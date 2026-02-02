import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { characters: true },
  });
  return res.json(user);
});

const createCharacterSchema = z.object({
  name: z.string().min(3),
  avatarUrl: z.string().url().optional(),
  raceClassId: z.string().uuid(),
  attributes: z.object({
    strength: z.number().min(1),
    defense: z.number().min(1),
    resilience: z.number().min(1),
    agility: z.number().min(1),
    speed: z.number().min(1),
    ki: z.number().min(1),
    critChance: z.number().min(0),
    critDamage: z.number().min(0),
  }),
});

router.post('/character', authenticate, async (req: AuthRequest, res) => {
  const parsed = createCharacterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const character = await prisma.character.create({
    data: {
      userId: req.user!.id,
      name: parsed.data.name,
      avatarUrl: parsed.data.avatarUrl,
      raceClassId: parsed.data.raceClassId,
      attributes: parsed.data.attributes,
      hp: 100,
      ki: 50,
      stamina: 100,
    },
  });

  await prisma.wallet.create({
    data: { characterId: character.id, aurum: 500, lumen: 10 },
  });

  return res.status(201).json(character);
});

router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  const character = await prisma.character.findFirst({
    where: { userId: req.user!.id },
  });
  return res.json(character);
});

router.get('/equip', authenticate, async (req: AuthRequest, res) => {
  const character = await prisma.character.findFirst({
    where: { userId: req.user!.id },
  });

  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const equipment = await prisma.equipment.findMany({
    where: { characterId: character.id },
    include: { item: true },
  });

  return res.json(equipment);
});

export default router;
