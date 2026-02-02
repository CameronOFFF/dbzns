import { Router } from 'express';
import { query } from '../db/mysql.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { simulateCombat } from '../services/combat.js';

const router = Router();

router.post('/attack', authenticate, async (req: AuthRequest, res) => {
  const { defenderId } = req.body as { defenderId: string };
  const attackerRows = await query<any[]>(
    'SELECT * FROM characters WHERE user_id = :id LIMIT 1',
    { id: req.user!.id }
  );
  const defenderRows = await query<any[]>('SELECT * FROM characters WHERE id = :id LIMIT 1', {
    id: defenderId,
  });
  const attacker = attackerRows[0];
  const defender = defenderRows[0];

  if (!attacker || !defender) {
    return res.status(404).json({ error: 'Combatant not found' });
  }

  const result = simulateCombat(
    {
      id: attacker.id,
      name: attacker.name,
      stats: JSON.parse(attacker.attributes),
    },
    {
      id: defender.id,
      name: defender.name,
      stats: JSON.parse(defender.attributes),
    }
  );

  await query(
    'INSERT INTO arena_matches (id, attacker_id, defender_id, match_type, result, replay) VALUES (UUID(), :attacker_id, :defender_id, :match_type, :result, :replay)',
    {
      attacker_id: attacker.id,
      defender_id: defender.id,
      match_type: 'ARENA',
      result: result.winnerId === attacker.id ? 'WIN' : 'LOSS',
      replay: JSON.stringify(result),
    }
  );

  await query(
    "INSERT INTO audit_logs (id, user_id, action, metadata) VALUES (UUID(), :user_id, 'PVP', :metadata)",
    { user_id: req.user!.id, metadata: JSON.stringify({ defenderId, result }) }
  );

  return res.json(result);
});

router.get('/rank', authenticate, async (_req, res) => {
  const rankings = await query<any[]>(
    'SELECT rankings.*, characters.name FROM rankings JOIN characters ON rankings.character_id = characters.id ORDER BY elo DESC LIMIT 50'
  );
  return res.json(rankings);
});

export default router;
