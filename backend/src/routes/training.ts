import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/start', authenticate, async (req: AuthRequest, res) => {
  const { durationMinutes } = req.body as { durationMinutes: number };
  const character = await prisma.character.findFirst({ where: { userId: req.user!.id } });
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const now = new Date();
  const endsAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

  const session = await prisma.trainingSession.create({
    data: {
      characterId: character.id,
      status: 'RUNNING',
      startedAt: now,
      endsAt,
      rewards: { xp: durationMinutes * 5 },
    },
  });

  return res.status(201).json(session);
});

router.post('/cancel', authenticate, async (req: AuthRequest, res) => {
  const { sessionId } = req.body as { sessionId: string };
  const session = await prisma.trainingSession.update({
    where: { id: sessionId },
    data: { status: 'CANCELLED' },
  });
  return res.json(session);
});

router.post('/claim', authenticate, async (req: AuthRequest, res) => {
  const { sessionId } = req.body as { sessionId: string };
  const session = await prisma.trainingSession.findUnique({ where: { id: sessionId } });
  if (!session || !session.endsAt || session.endsAt > new Date()) {
    return res.status(400).json({ error: 'Training not completed' });
  }

  await prisma.trainingSession.update({
    where: { id: sessionId },
    data: { status: 'COMPLETED' },
  });

  await prisma.auditLog.create({
    data: { userId: req.user!.id, action: 'DROP', metadata: { sessionId, rewards: session.rewards } },
  });

  return res.json({ message: 'Training rewards claimed', rewards: session.rewards });
});

export default router;
