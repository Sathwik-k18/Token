export const percentUsed = (used: number, total: number) => (total ? Math.min(100, (used / total) * 100) : 0);
