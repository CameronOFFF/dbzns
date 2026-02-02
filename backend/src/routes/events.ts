import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/events', authenticate, async (_req, res) => {
  const events = await prisma.event.findMany();
  return res.json(events);
});

router.get('/challenges', authenticate, async (_req, res) => {
  const challenges = await prisma.challenge.findMany();
  return res.json(challenges);
});

router.get('/tournaments', authenticate, async (_req, res) => {
  const tournaments = await prisma.tournament.findMany();
  return res.json(tournaments);
});

export default router;
