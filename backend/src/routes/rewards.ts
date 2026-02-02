import { Router } from 'express';
import { query } from '../db/mysql.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/daily', authenticate, async (req: AuthRequest, res) => {
  const characters = await query<any[]>('SELECT * FROM characters WHERE user_id = :id LIMIT 1', {
    id: req.user!.id,
  });
  const character = characters[0];
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await query<any[]>(
    'SELECT * FROM daily_reward_claims WHERE character_id = :character_id AND claimed_at >= :today LIMIT 1',
    { character_id: character.id, today }
  );

  if (existing.length > 0) {
    return res.status(400).json({ error: 'Daily reward already claimed' });
  }

  await query(
    'INSERT INTO daily_reward_claims (id, character_id, day_index) VALUES (UUID(), :character_id, 1)',
    { character_id: character.id }
  );
  const claims = await query<any[]>(
    'SELECT * FROM daily_reward_claims WHERE character_id = :character_id ORDER BY claimed_at DESC LIMIT 1',
    { character_id: character.id }
  );

  return res.json({ message: 'Reward claimed', claim: claims[0] });
});

export default router;
