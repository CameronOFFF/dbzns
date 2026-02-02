import { Router } from 'express';
import { query } from '../db/mysql.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  const chapters = await query<any[]>('SELECT * FROM saga_chapters');
  return res.json(chapters);
});

export default router;
