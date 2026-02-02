import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  const quests = await prisma.quest.findMany();
  return res.json(quests);
});

router.post('/claim', authenticate, async (req: AuthRequest, res) => {
  const character = await prisma.character.findFirst({ where: { userId: req.user!.id } });
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const progressId = req.body?.progressId as string;
  const progress = await prisma.questProgress.findUnique({ where: { id: progressId } });

  if (!progress || progress.characterId !== character.id || progress.claimed) {
    return res.status(400).json({ error: 'Quest not ready' });
  }

  await prisma.questProgress.update({
    where: { id: progressId },
    data: { claimed: true },
  });

  await prisma.auditLog.create({
    data: { userId: req.user!.id, action: 'TRANSACTION', metadata: { progressId } },
  });

  return res.json({ message: 'Rewards claimed' });
});

export default router;
