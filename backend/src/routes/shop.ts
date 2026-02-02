import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/items', authenticate, async (_req, res) => {
  const items = await prisma.shopItem.findMany({ include: { item: true } });
  return res.json(items);
});

router.post('/buy', authenticate, async (req: AuthRequest, res) => {
  const { shopItemId } = req.body as { shopItemId: string };
  const character = await prisma.character.findFirst({ where: { userId: req.user!.id } });

  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  const shopItem = await prisma.shopItem.findUnique({ where: { id: shopItemId }, include: { item: true } });
  if (!shopItem) {
    return res.status(404).json({ error: 'Item not found' });
  }

  await prisma.inventoryItem.create({
    data: { characterId: character.id, itemId: shopItem.itemId, quantity: 1 },
  });

  await prisma.transactionLog.create({
    data: {
      characterId: character.id,
      type: 'SHOP_BUY',
      delta: -shopItem.price,
      currency: shopItem.currency,
      meta: { itemId: shopItem.itemId },
    },
  });

  await prisma.auditLog.create({
    data: { userId: req.user!.id, action: 'TRANSACTION', metadata: { shopItemId } },
  });

  return res.json({ message: 'Item purchased' });
});

export default router;
