import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/daily', authenticate, async (req: AuthRequest, res) => {
  const character = await prisma.character.findFirst({ where: { userId: req.user!.id } });
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.dailyRewardClaim.findFirst({
    where: {
      characterId: character.id,
      claimedAt: { gte: today },
    },
  });

  if (existing) {
    return res.status(400).json({ error: 'Daily reward already claimed' });
  }

  const claim = await prisma.dailyRewardClaim.create({
    data: { characterId: character.id, dayIndex: 1 },
  });

  return res.json({ message: 'Reward claimed', claim });
});

export default router;
