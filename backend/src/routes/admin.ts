import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});

router.get('/logs', async (req, res) => {
  const { userId, start, end } = req.query as { userId?: string; start?: string; end?: string };
  const logs = await prisma.auditLog.findMany({
    where: {
      userId: userId ?? undefined,
      createdAt: {
        gte: start ? new Date(start) : undefined,
        lte: end ? new Date(end) : undefined,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return res.json(logs);
});

router.post('/reward', async (req: AuthRequest, res) => {
  const { characterId, aurum, lumen } = req.body as { characterId: string; aurum?: number; lumen?: number };
  const wallet = await prisma.wallet.findUnique({ where: { characterId } });
  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }

  const updated = await prisma.wallet.update({
    where: { characterId },
    data: {
      aurum: wallet.aurum + (aurum ?? 0),
      lumen: wallet.lumen + (lumen ?? 0),
    },
  });

  await prisma.auditLog.create({
    data: { userId: req.user!.id, action: 'ADMIN', metadata: { characterId, aurum, lumen } },
  });

  return res.json(updated);
});

export default router;
