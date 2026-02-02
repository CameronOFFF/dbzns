import { Router } from 'express';
import crypto from 'crypto';
import { query } from '../db/mysql.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/create', authenticate, async (req: AuthRequest, res) => {
  const { name, description } = req.body as { name: string; description: string };
  const characters = await query<any[]>('SELECT * FROM characters WHERE user_id = :id LIMIT 1', {
    id: req.user!.id,
  });
  const character = characters[0];
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const clanId = crypto.randomUUID();
  await query('INSERT INTO clans (id, name, description) VALUES (:id, :name, :description)', {
    id: clanId,
    name,
    description,
  });

  await query(
    "INSERT INTO clan_members (id, clan_id, character_id, role) VALUES (UUID(), :clan_id, :character_id, 'LEADER')",
    { clan_id: clanId, character_id: character.id }
  );

  const clans = await query<any[]>('SELECT * FROM clans WHERE id = :id', { id: clanId });
  return res.status(201).json(clans[0]);
});

router.post('/invite', authenticate, async (req: AuthRequest, res) => {
  const { characterId } = req.body as { characterId: string };
  const members = await query<any[]>('SELECT * FROM clan_members WHERE character_id = :id LIMIT 1', {
    id: characterId,
  });
  const member = members[0];

  if (!member) {
    return res.status(404).json({ error: 'Target not found' });
  }

  return res.json({ message: 'Invite sent (placeholder)' });
});

export default router;
