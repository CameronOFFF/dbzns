import { Router } from 'express';
import { query } from '../db/mysql.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/items', authenticate, async (_req, res) => {
  const items = await query<any[]>(
    'SELECT shop_items.*, items.name, items.description, items.category, items.rarity FROM shop_items JOIN items ON shop_items.item_id = items.id'
  );
  return res.json(items);
});

router.post('/buy', authenticate, async (req: AuthRequest, res) => {
  const { shopItemId } = req.body as { shopItemId: string };
  const characters = await query<any[]>('SELECT * FROM characters WHERE user_id = :id LIMIT 1', {
    id: req.user!.id,
  });
  const character = characters[0];

  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const shopItems = await query<any[]>(
    'SELECT * FROM shop_items WHERE id = :id LIMIT 1',
    { id: shopItemId }
  );
  const shopItem = shopItems[0];
  if (!shopItem) {
    return res.status(404).json({ error: 'Item not found' });
  }

  await query(
    'INSERT INTO inventory_items (id, character_id, item_id, quantity) VALUES (UUID(), :character_id, :item_id, 1)',
    { character_id: character.id, item_id: shopItem.item_id }
  );

  await query(
    'INSERT INTO transaction_logs (id, character_id, type, delta, currency, meta) VALUES (UUID(), :character_id, :type, :delta, :currency, :meta)',
    {
      character_id: character.id,
      type: 'SHOP_BUY',
      delta: -shopItem.price,
      currency: shopItem.currency,
      meta: JSON.stringify({ itemId: shopItem.item_id }),
    }
  );

  await query(
    "INSERT INTO audit_logs (id, user_id, action, metadata) VALUES (UUID(), :user_id, 'TRANSACTION', :metadata)",
    { user_id: req.user!.id, metadata: JSON.stringify({ shopItemId }) }
  );

  return res.json({ message: 'Item purchased' });
});

export default router;
