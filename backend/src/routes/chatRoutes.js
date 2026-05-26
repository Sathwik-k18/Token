import express from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db/index.js';
import {
  canAfford,
  deductTokens,
  estimatePromptCost,
  applyDailyRollover,
  isBalanceCheckDisabled
} from '../services/tokenService.js';
import { streamCompletion } from '../services/geminiService.js';

export const chatRouter = express.Router();

chatRouter.post('/send', async (req, res) => {
  const { chatId = randomUUID(), prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const estimated = estimatePromptCost(prompt);
  const checksDisabled = isBalanceCheckDisabled();
  const wallet = applyDailyRollover();

  if (!checksDisabled && !canAfford(estimated)) {
    return res.status(402).json({
      error: 'Insufficient balance',
      estimated,
      balance: wallet.balance
    });
  }

  db.prepare('INSERT OR IGNORE INTO Chats (id, title, createdAt) VALUES (?, ?, ?)').run(
    chatId,
    prompt.slice(0, 48),
    new Date().toISOString()
  );

  const userMessageId = randomUUID();
  db.prepare('INSERT INTO Messages (id, chatId, role, content, createdAt) VALUES (?, ?, ?, ?, ?)').run(
    userMessageId,
    chatId,
    'user',
    prompt,
    new Date().toISOString()
  );

  let completion;
  try {
    completion = await streamCompletion({ prompt });
  } catch (err) {
    console.error('Gemini error:', err);
    return res.status(502).json({
      error: 'AI provider request failed',
      details: err?.message || 'Unknown Gemini provider error'
    });
  }

  const total = completion.usage.input_tokens + completion.usage.output_tokens;

  try {
    deductTokens(total, { chatId, userMessageId, provider: completion.provider?.model });
  } catch (err) {
    return res.status(409).json({ error: err.message });
  }

  db.prepare('INSERT INTO Messages (id, chatId, role, content, inputTokens, outputTokens, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    randomUUID(),
    chatId,
    'assistant',
    completion.content,
    completion.usage.input_tokens,
    completion.usage.output_tokens,
    new Date().toISOString()
  );

  return res.json({
    chatId,
    content: completion.content,
    usage: completion.usage,
    totalTokens: total,
    estimated,
    balanceCheckDisabled: checksDisabled
  });
});
