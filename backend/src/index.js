import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { walletRouter } from './routes/walletRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';

const app = express();

const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: frontendOrigin }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, provider: 'gemini' });
});

app.use('/api/wallet', walletRouter);
app.use('/api/chat', chatRouter);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = createServer(app);
const io = new Server(server, { cors: { origin: frontendOrigin } });
io.on('connection', () => {});

const port = Number(process.env.PORT || 4000);
server.listen(port, () => console.log(`Backend running on ${port}`));
