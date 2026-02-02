import { Router } from 'express';
import { query } from '../db/mysql.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/start', authenticate, async (req: AuthRequest, res) => {
  const { durationMinutes } = req.body as { durationMinutes: number };
  const characters = await query<any[]>('SELECT * FROM characters WHERE user_id = :id LIMIT 1', {
    id: req.user!.id,
  });
  const character = characters[0];
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const now = new Date();
  const endsAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

  await query(
    'INSERT INTO training_sessions (id, character_id, status, started_at, ends_at, rewards) VALUES (UUID(), :character_id, :status, :started_at, :ends_at, :rewards)',
    {
      character_id: character.id,
      status: 'RUNNING',
      started_at: now,
      ends_at: endsAt,
      rewards: JSON.stringify({ xp: durationMinutes * 5 }),
    }
  );
  const sessions = await query<any[]>(
    'SELECT * FROM training_sessions WHERE character_id = :character_id ORDER BY created_at DESC LIMIT 1',
    { character_id: character.id }
  );

  return res.status(201).json(sessions[0]);
});

router.post('/cancel', authenticate, async (req: AuthRequest, res) => {
  const { sessionId } = req.body as { sessionId: string };
  await query('UPDATE training_sessions SET status = :status WHERE id = :id', {
    status: 'CANCELLED',
    id: sessionId,
  });
  const sessions = await query<any[]>('SELECT * FROM training_sessions WHERE id = :id LIMIT 1', { id: sessionId });
  return res.json(sessions[0]);
});

router.post('/claim', authenticate, async (req: AuthRequest, res) => {
  const { sessionId } = req.body as { sessionId: string };
  const sessions = await query<any[]>('SELECT * FROM training_sessions WHERE id = :id LIMIT 1', {
    id: sessionId,
  });
  const session = sessions[0];
  if (!session || !session.ends_at || new Date(session.ends_at) > new Date()) {
    return res.status(400).json({ error: 'Training not completed' });
  }

  await query('UPDATE training_sessions SET status = :status WHERE id = :id', {
    status: 'COMPLETED',
    id: sessionId,
  });

  await query(
    "INSERT INTO audit_logs (id, user_id, action, metadata) VALUES (UUID(), :user_id, 'DROP', :metadata)",
    { user_id: req.user!.id, metadata: JSON.stringify({ sessionId, rewards: session.rewards }) }
  );

  return res.json({ message: 'Training rewards claimed', rewards: session.rewards });
});

export default router;
