const API_BASE = 'http://localhost:4000/api';

export async function sendMessage(prompt: string) {
  const res = await fetch(`${API_BASE}/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error('Unable to send message');
  return res.json();
}

export async function getWallet() {
  const res = await fetch(`${API_BASE}/wallet`);
  return res.json();
}
