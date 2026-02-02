import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  const chapters = await prisma.sagaChapter.findMany();
  return res.json(chapters);
});

export default router;
