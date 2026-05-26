import express from 'express';
import { db } from '../db/index.js';
import { applyDailyRollover } from '../services/tokenService.js';

export const walletRouter = express.Router();

walletRouter.get('/', (_req, res) => {
  const wallet = applyDailyRollover();
  const settings = db.prepare('SELECT * FROM UserSettings WHERE id = 1').get();
  res.json({ wallet, settings });
});

walletRouter.patch('/settings', (req, res) => {
  const { dailyAllowance, maxWalletCap } = req.body;
  db.prepare('UPDATE UserSettings SET dailyAllowance = COALESCE(?, dailyAllowance), maxWalletCap = COALESCE(?, maxWalletCap) WHERE id = 1')
    .run(dailyAllowance, maxWalletCap);
  res.json({ ok: true });
});
