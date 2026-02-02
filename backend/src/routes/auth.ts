import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { hashPassword, verifyLegacyMd5, verifyPassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { authRateLimiter } from '../middleware/rateLimit.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { authenticator } from 'otplib';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
});

router.post('/register', authRateLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { email, username, password } = parsed.data;
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      preferences: { language: 'pt-BR', theme: 'dark', notifications: true },
    },
  });

  await prisma.auditLog.create({
    data: { userId: user.id, action: 'LOGIN', metadata: { type: 'register' } },
  });

  return res.status(201).json({ id: user.id, email: user.email, username: user.username });
});

const loginSchema = z.object({
  identifier: z.string(),
  password: z.string().min(8),
  token: z.string().optional(),
});

router.post('/login', authRateLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { identifier, password, token } = parsed.data;
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const legacyEnabled = process.env.LEGACY_MD5 === 'true';
  let valid = await verifyPassword(password, user.passwordHash);

  if (!valid && legacyEnabled && user.legacyMd5) {
    const legacyValid = verifyLegacyMd5(password, user.passwordHash);
    if (legacyValid) {
      const newHash = await hashPassword(password);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash, legacyMd5: false },
      });
      valid = true;
    }
  }

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.twoFactorSecret) {
    if (!token || !authenticator.verify({ token, secret: user.twoFactorSecret })) {
      return res.status(401).json({ error: 'Invalid 2FA token' });
    }
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.auditLog.create({
    data: { userId: user.id, action: 'LOGIN', metadata: { type: 'login' } },
  });

  return res.json({ accessToken, refreshToken });
});

router.post('/refresh', async (req, res) => {
  const token = req.body?.refreshToken;
  if (!token) {
    return res.status(400).json({ error: 'Missing refresh token' });
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    return res.status(401).json({ error: 'Refresh token invalid' });
  }

  try {
    const payload = verifyRefreshToken(token) as { sub: string; role: string };
    const accessToken = signAccessToken({ sub: payload.sub, role: payload.role });
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: 'Refresh token invalid' });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.body?.refreshToken;
  if (token) {
    await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
  }
  return res.json({ message: 'Logged out' });
});

router.post('/2fa/setup', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const secret = authenticator.generateSecret();
  return res.json({ secret, otpauth: authenticator.keyuri(user.email, 'Chrona Rift', secret) });
});

router.post('/2fa/confirm', authenticate, async (req: AuthRequest, res) => {
  const { token, secret } = req.body as { token: string; secret: string };
  const valid = authenticator.verify({ token, secret });
  if (!valid) {
    return res.status(400).json({ error: 'Invalid 2FA token' });
  }

  await prisma.user.update({ where: { id: req.user!.id }, data: { twoFactorSecret: secret } });
  return res.json({ message: '2FA enabled' });
});

router.post('/2fa/disable', authenticate, async (req: AuthRequest, res) => {
  await prisma.user.update({ where: { id: req.user!.id }, data: { twoFactorSecret: null } });
  return res.json({ message: '2FA disabled' });
});

export default router;
