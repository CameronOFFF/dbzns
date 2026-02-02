import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/create', authenticate, async (req: AuthRequest, res) => {
  const { name, description } = req.body as { name: string; description: string };
  const character = await prisma.character.findFirst({ where: { userId: req.user!.id } });
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const clan = await prisma.clan.create({
    data: { name, description },
  });

  await prisma.clanMember.create({
    data: {
      clanId: clan.id,
      characterId: character.id,
      role: 'LEADER',
    },
  });

  return res.status(201).json(clan);
});

router.post('/invite', authenticate, async (req: AuthRequest, res) => {
  const { characterId } = req.body as { characterId: string };
  const member = await prisma.clanMember.findFirst({
    where: { characterId },
  });

  if (!member) {
    return res.status(404).json({ error: 'Target not found' });
  }

  return res.json({ message: 'Invite sent (placeholder)' });
});

export default router;
