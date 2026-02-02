import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import playerRoutes from './routes/player.js';
import questRoutes from './routes/quests.js';
import arenaRoutes from './routes/arena.js';
import shopRoutes from './routes/shop.js';
import clanRoutes from './routes/clan.js';
import adminRoutes from './routes/admin.js';
import trainingRoutes from './routes/training.js';
import sagaRoutes from './routes/sagas.js';
import eventRoutes from './routes/events.js';
import rewardRoutes from './routes/rewards.js';
import { apiRateLimiter } from './middleware/rateLimit.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(apiRateLimiter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/player', playerRoutes);
app.use('/quests', questRoutes);
app.use('/arena', arenaRoutes);
app.use('/shop', shopRoutes);
app.use('/clan', clanRoutes);
app.use('/admin', adminRoutes);
app.use('/training', trainingRoutes);
app.use('/sagas', sagaRoutes);
app.use('/events', eventRoutes);
app.use('/rewards', rewardRoutes);

export default app;
