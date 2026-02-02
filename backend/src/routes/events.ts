import { Router } from 'express';
import { query } from '../db/mysql.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/events', authenticate, async (_req, res) => {
  const events = await query<any[]>('SELECT * FROM events');
  return res.json(events);
});

router.get('/challenges', authenticate, async (_req, res) => {
  const challenges = await query<any[]>('SELECT * FROM challenges');
  return res.json(challenges);
});

router.get('/tournaments', authenticate, async (_req, res) => {
  const tournaments = await query<any[]>('SELECT * FROM tournaments');
  return res.json(tournaments);
});

export default router;
