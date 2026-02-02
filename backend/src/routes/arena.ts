import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { simulateCombat } from '../services/combat.js';

const router = Router();

router.post('/attack', authenticate, async (req: AuthRequest, res) => {
  const { defenderId } = req.body as { defenderId: string };
  const attacker = await prisma.character.findFirst({ where: { userId: req.user!.id } });
  const defender = await prisma.character.findUnique({ where: { id: defenderId } });

  if (!attacker || !defender) {
    return res.status(404).json({ error: 'Combatant not found' });
  }

  const result = simulateCombat(
    {
      id: attacker.id,
      name: attacker.name,
      stats: attacker.attributes as any,
    },
    {
      id: defender.id,
      name: defender.name,
      stats: defender.attributes as any,
    }
  );

  await prisma.arenaMatch.create({
    data: {
      attackerId: attacker.id,
      defenderId: defender.id,
      matchType: 'ARENA',
      result: result.winnerId === attacker.id ? 'WIN' : 'LOSS',
      replay: result,
    },
  });

  await prisma.auditLog.create({
    data: { userId: req.user!.id, action: 'PVP', metadata: { defenderId, result } },
  });

  return res.json(result);
});

router.get('/rank', authenticate, async (_req, res) => {
  const rankings = await prisma.ranking.findMany({
    take: 50,
    orderBy: { elo: 'desc' },
    include: { character: true },
  });
  return res.json(rankings);
});

export default router;
