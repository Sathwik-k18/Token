import { db } from '../db/index.js';

const today = () => new Date().toISOString().slice(0, 10);

export function applyDailyRollover() {
  const settings = db.prepare('SELECT * FROM UserSettings WHERE id = 1').get();
  const wallet = db.prepare('SELECT * FROM TokenWallet WHERE id = 1').get();
  const last = settings.lastRolloverAt.slice(0, 10);
  const current = today();
  if (last === current) return wallet;

  const days = Math.max(1, Math.ceil((new Date(current) - new Date(last)) / 86400000));
  const added = settings.dailyAllowance * days;
  const cap = settings.maxWalletCap;
  let newBalance = wallet.balance + added;
  if (cap > 0) newBalance = Math.min(newBalance, cap);

  db.prepare('UPDATE TokenWallet SET balance = ?, usedToday = 0, savedTotal = savedTotal + ?, updatedAt = ? WHERE id = 1')
    .run(newBalance, Math.max(0, added - wallet.usedToday), new Date().toISOString());
  db.prepare('UPDATE UserSettings SET lastRolloverAt = ? WHERE id = 1').run(new Date().toISOString());
  db.prepare('INSERT INTO Transactions (type, tokens, metadata, createdAt) VALUES (?, ?, ?, ?)')
    .run('ROLLOVER_CREDIT', added, JSON.stringify({ days }), new Date().toISOString());
  return db.prepare('SELECT * FROM TokenWallet WHERE id = 1').get();
}

export function estimatePromptCost(text) {
  return Math.ceil((text?.length || 0) / 4) + 256;
}

export function isBalanceCheckDisabled() {
  return String(process.env.DISABLE_BALANCE_CHECK || 'false').toLowerCase() === 'true';
}

export function canAfford(estimated) {
  if (isBalanceCheckDisabled()) return true;
  const wallet = applyDailyRollover();
  return wallet.balance >= estimated;
}

export function deductTokens(totalTokens, metadata = {}) {
  if (isBalanceCheckDisabled()) {
    db.prepare('INSERT INTO Transactions (type, tokens, metadata, createdAt) VALUES (?, ?, ?, ?)')
      .run('USAGE_DEBIT_SKIPPED', totalTokens, JSON.stringify(metadata), new Date().toISOString());
    return;
  }

  const wallet = db.prepare('SELECT * FROM TokenWallet WHERE id = 1').get();
  if (wallet.balance < totalTokens) throw new Error('Insufficient balance');
  const now = new Date().toISOString();
  db.prepare('UPDATE TokenWallet SET balance = balance - ?, usedToday = usedToday + ?, updatedAt = ? WHERE id = 1').run(totalTokens, totalTokens, now);
  db.prepare('INSERT INTO Transactions (type, tokens, metadata, createdAt) VALUES (?, ?, ?, ?)')
    .run('USAGE_DEBIT', totalTokens, JSON.stringify(metadata), now);
}
