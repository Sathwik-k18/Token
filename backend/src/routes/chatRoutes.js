import express from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db/index.js';
import { canAfford, deductTokens, estimatePromptCost } from '../services/tokenService.js';
import { streamCompletion } from '../services/openaiService.js';

export const chatRouter = express.Router();

chatRouter.post('/send', async (req, res) => {
  const { chatId = randomUUID(), prompt } = req.body;
  const estimated = estimatePromptCost(prompt);
  if (!canAfford(estimated)) return res.status(402).json({ error: 'Insufficient balance', estimated });

  db.prepare('INSERT OR IGNORE INTO Chats (id, title, createdAt) VALUES (?, ?, ?)').run(chatId, prompt.slice(0, 48), new Date().toISOString());
  const userMessageId = randomUUID();
  db.prepare('INSERT INTO Messages (id, chatId, role, content, createdAt) VALUES (?, ?, ?, ?, ?)')
    .run(userMessageId, chatId, 'user', prompt, new Date().toISOString());

  let streamed = '';
  const completion = await streamCompletion({
    prompt,
    onToken: (token) => { streamed += token; }
  });

  const total = completion.usage.input_tokens + completion.usage.output_tokens;
  deductTokens(total, { chatId, userMessageId });

  db.prepare('INSERT INTO Messages (id, chatId, role, content, inputTokens, outputTokens, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(randomUUID(), chatId, 'assistant', completion.content, completion.usage.input_tokens, completion.usage.output_tokens, new Date().toISOString());

  res.json({ chatId, content: completion.content, usage: completion.usage, totalTokens: total });
});
