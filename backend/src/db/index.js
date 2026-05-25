import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { schemaSQL } from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../database/token_wallet.db');
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(schemaSQL);

const now = new Date().toISOString();
db.prepare('INSERT OR IGNORE INTO UserSettings (id, lastRolloverAt) VALUES (1, ?)').run(now);
db.prepare('INSERT OR IGNORE INTO TokenWallet (id, updatedAt) VALUES (1, ?)').run(now);
