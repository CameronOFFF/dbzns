import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { prisma } from './db/prisma.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'],
  },
});

io.on('connection', (socket) => {
  socket.on('chat:global', async ({ message, senderId }) => {
    const saved = await prisma.chatMessage.create({
      data: { channel: 'global', content: message, senderId },
    });
    io.emit('chat:global', saved);
  });

  socket.on('chat:clan', async ({ message, senderId, clanId }) => {
    const saved = await prisma.chatMessage.create({
      data: { channel: `clan:${clanId}`, content: message, senderId },
    });
    io.emit(`chat:clan:${clanId}`, saved);
  });
});

const port = Number(process.env.PORT ?? 4000);

server.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
