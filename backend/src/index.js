import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { walletRouter } from './routes/walletRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/wallet', walletRouter);
app.use('/api/chat', chatRouter);

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
io.on('connection', () => {});

const port = Number(process.env.PORT || 4000);
server.listen(port, () => console.log(`Backend running on ${port}`));
