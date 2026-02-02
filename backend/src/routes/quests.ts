import { Router } from 'express';
import { query } from '../db/mysql.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  const quests = await query<any[]>('SELECT * FROM quests');
  return res.json(quests);
});

router.post('/claim', authenticate, async (req: AuthRequest, res) => {
  const characters = await query<any[]>('SELECT * FROM characters WHERE user_id = :id LIMIT 1', {
    id: req.user!.id,
  });
  const character = characters[0];
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const progressId = req.body?.progressId as string;
  const progressRows = await query<any[]>(
    'SELECT * FROM quest_progress WHERE id = :id LIMIT 1',
    { id: progressId }
  );
  const progress = progressRows[0];

  if (!progress || progress.character_id !== character.id || progress.claimed) {
    return res.status(400).json({ error: 'Quest not ready' });
  }

  await query('UPDATE quest_progress SET claimed = 1 WHERE id = :id', { id: progressId });

  await query(
    "INSERT INTO audit_logs (id, user_id, action, metadata) VALUES (UUID(), :user_id, 'TRANSACTION', :metadata)",
    { user_id: req.user!.id, metadata: JSON.stringify({ progressId }) }
  );

  return res.json({ message: 'Rewards claimed' });
});

export default router;
