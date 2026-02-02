import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/mysql.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { randomUUID } from 'crypto';

const router = Router();

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  const users = await query<any[]>('SELECT id, email, username, role, preferences FROM users WHERE id = :id', {
    id: req.user!.id,
  });
  const user = users[0];
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const characters = await query<any[]>('SELECT * FROM characters WHERE user_id = :id', { id: req.user!.id });
  return res.json({ ...user, characters });
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

  const characterId = randomUUID();
  await query(
    'INSERT INTO characters (id, user_id, name, avatar_url, race_class_id, attributes, hp, ki, stamina) VALUES (:id, :user_id, :name, :avatar_url, :race_class_id, :attributes, :hp, :ki, :stamina)',
    {
      id: characterId,
      user_id: req.user!.id,
      name: parsed.data.name,
      avatar_url: parsed.data.avatarUrl ?? null,
      race_class_id: parsed.data.raceClassId,
      attributes: JSON.stringify(parsed.data.attributes),
      hp: 100,
      ki: 50,
      stamina: 100,
    }
  );

  await query('INSERT INTO wallets (id, character_id, aurum, lumen) VALUES (UUID(), :character_id, 500, 10)', {
    character_id: characterId,
  });

  const [created] = await query<any[]>('SELECT * FROM characters WHERE id = :id', { id: characterId });
  return res.status(201).json(created);
});

router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  const characters = await query<any[]>('SELECT * FROM characters WHERE user_id = :id LIMIT 1', {
    id: req.user!.id,
  });
  return res.json(characters[0] ?? null);
});

router.get('/equip', authenticate, async (req: AuthRequest, res) => {
  const characters = await query<any[]>('SELECT * FROM characters WHERE user_id = :id LIMIT 1', {
    id: req.user!.id,
  });
  const character = characters[0];

  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const equipment = await query<any[]>(
    'SELECT equipment.*, items.name, items.description, items.category, items.rarity, items.effects FROM equipment JOIN items ON equipment.item_id = items.id WHERE equipment.character_id = :character_id',
    { character_id: character.id }
  );

  return res.json(equipment);
});

export default router;
