import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/mysql.js';
import { hashPassword, verifyLegacyMd5, verifyPassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { authRateLimiter } from '../middleware/rateLimit.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { authenticator } from 'otplib';
import { randomUUID } from 'crypto';

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

  const userId = randomUUID();
  await query(
    'INSERT INTO users (id, email, username, password_hash, preferences) VALUES (:id, :email, :username, :password_hash, :preferences)',
    {
      id: userId,
      email,
      username,
      password_hash: passwordHash,
      preferences: JSON.stringify({ language: 'pt-BR', theme: 'dark', notifications: true }),
    }
  );

  await query(
    "INSERT INTO audit_logs (id, user_id, action, metadata) VALUES (UUID(), :user_id, 'LOGIN', :metadata)",
    { user_id: userId, metadata: JSON.stringify({ type: 'register' }) }
  );

  return res.status(201).json({ id: userId, email, username });
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
  const users = await query<any[]>(
    'SELECT * FROM users WHERE email = :identifier OR username = :identifier LIMIT 1',
    { identifier }
  );
  const user = users[0];

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const legacyEnabled = process.env.LEGACY_MD5 === 'true';
  let valid = await verifyPassword(password, user.password_hash);

  if (!valid && legacyEnabled && user.legacy_md5) {
    const legacyValid = verifyLegacyMd5(password, user.password_hash);
    if (legacyValid) {
      const newHash = await hashPassword(password);
      await query('UPDATE users SET password_hash = :password_hash, legacy_md5 = 0 WHERE id = :id', {
        password_hash: newHash,
        id: user.id,
      });
      valid = true;
    }
  }

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.two_factor_secret) {
    if (!token || !authenticator.verify({ token, secret: user.two_factor_secret })) {
      return res.status(401).json({ error: 'Invalid 2FA token' });
    }
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  await query(
    'INSERT INTO refresh_tokens (id, token, user_id, expires_at) VALUES (UUID(), :token, :user_id, :expires_at)',
    {
      token: refreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }
  );

  await query(
    "INSERT INTO audit_logs (id, user_id, action, metadata) VALUES (UUID(), :user_id, 'LOGIN', :metadata)",
    { user_id: user.id, metadata: JSON.stringify({ type: 'login' }) }
  );

  return res.json({ accessToken, refreshToken });
});

router.post('/refresh', async (req, res) => {
  const token = req.body?.refreshToken;
  if (!token) {
    return res.status(400).json({ error: 'Missing refresh token' });
  }

  const storedRows = await query<any[]>(
    'SELECT * FROM refresh_tokens WHERE token = :token LIMIT 1',
    { token }
  );
  const stored = storedRows[0];
  if (!stored || stored.revoked || new Date(stored.expires_at) < new Date()) {
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
    await query('UPDATE refresh_tokens SET revoked = 1 WHERE token = :token', { token });
  }
  return res.json({ message: 'Logged out' });
});

router.post('/2fa/setup', authenticate, async (req: AuthRequest, res) => {
  const users = await query<any[]>('SELECT * FROM users WHERE id = :id LIMIT 1', { id: req.user!.id });
  const user = users[0];
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

  await query('UPDATE users SET two_factor_secret = :secret WHERE id = :id', {
    secret,
    id: req.user!.id,
  });
  return res.json({ message: '2FA enabled' });
});

router.post('/2fa/disable', authenticate, async (req: AuthRequest, res) => {
  await query('UPDATE users SET two_factor_secret = NULL WHERE id = :id', { id: req.user!.id });
  return res.json({ message: '2FA disabled' });
});

export default router;
