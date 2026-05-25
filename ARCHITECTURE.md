# Project Structure

- `frontend/components/*`: Reusable UI modules grouped by responsibility (navbar, sidebar, chat, token wallet, dashboard).
- `frontend/services/api`: Client API wrappers.
- `frontend/services/token`: Token-focused client utilities.
- `backend/src/routes`: API entry points.
- `backend/src/services`: Token accounting and AI provider logic.
- `backend/src/db`: SQLite bootstrap and schema.
- `backend/database`: Persistent SQLite file.

## Important logic notes
- Token rollover is computed once per day in `applyDailyRollover` before wallet reads and spend checks.
- Prompt requests are pre-estimated, rejected if underfunded, then exact usage is debited after completion.
- All usage debits and credits are written to `Transactions` for auditability.
