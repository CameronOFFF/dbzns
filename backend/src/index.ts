import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { query } from './db/mysql.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'],
  },
});

io.on('connection', (socket) => {
  socket.on('chat:global', async ({ message, senderId }) => {
    await query(
      'INSERT INTO chat_messages (id, channel, content, sender_id) VALUES (UUID(), :channel, :content, :sender_id)',
      { channel: 'global', content: message, sender_id: senderId }
    );
    const rows = await query<any[]>(
      'SELECT * FROM chat_messages WHERE channel = :channel ORDER BY created_at DESC LIMIT 1',
      { channel: 'global' }
    );
    io.emit('chat:global', rows[0]);
  });

  socket.on('chat:clan', async ({ message, senderId, clanId }) => {
    const channel = `clan:${clanId}`;
    await query(
      'INSERT INTO chat_messages (id, channel, content, sender_id) VALUES (UUID(), :channel, :content, :sender_id)',
      { channel, content: message, sender_id: senderId }
    );
    const rows = await query<any[]>(
      'SELECT * FROM chat_messages WHERE channel = :channel ORDER BY created_at DESC LIMIT 1',
      { channel }
    );
    io.emit(`chat:clan:${clanId}`, rows[0]);
  });
});

const port = Number(process.env.PORT ?? 4000);

server.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
