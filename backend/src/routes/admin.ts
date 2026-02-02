import { Router } from 'express';
import { query } from '../db/mysql.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users', async (_req, res) => {
  const users = await query<any[]>('SELECT id, email, username, role, created_at FROM users');
  return res.json(users);
});

router.get('/logs', async (req, res) => {
  const { userId, start, end } = req.query as { userId?: string; start?: string; end?: string };
  const logs = await query<any[]>(
    `SELECT * FROM audit_logs\n     WHERE (:user_id IS NULL OR user_id = :user_id)\n     AND (:start IS NULL OR created_at >= :start)\n     AND (:end IS NULL OR created_at <= :end)\n     ORDER BY created_at DESC`,
    { user_id: userId ?? null, start: start ?? null, end: end ?? null }
  );
  return res.json(logs);
});

router.post('/reward', async (req: AuthRequest, res) => {
  const { characterId, aurum, lumen } = req.body as { characterId: string; aurum?: number; lumen?: number };
  const wallets = await query<any[]>(
    'SELECT * FROM wallets WHERE character_id = :character_id LIMIT 1',
    { character_id: characterId }
  );
  const wallet = wallets[0];
  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }

  const newAurum = wallet.aurum + (aurum ?? 0);
  const newLumen = wallet.lumen + (lumen ?? 0);
  await query('UPDATE wallets SET aurum = :aurum, lumen = :lumen WHERE character_id = :character_id', {
    aurum: newAurum,
    lumen: newLumen,
    character_id: characterId,
  });

  await query(
    "INSERT INTO audit_logs (id, user_id, action, metadata) VALUES (UUID(), :user_id, 'ADMIN', :metadata)",
    { user_id: req.user!.id, metadata: JSON.stringify({ characterId, aurum, lumen }) }
  );

  return res.json({ characterId, aurum: newAurum, lumen: newLumen });
});

export default router;
