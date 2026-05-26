const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

export async function sendMessage(prompt: string) {
  const res = await fetch(`${API_BASE}/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) {
    let errorMessage = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      errorMessage = body?.error || body?.details || errorMessage;
    } catch {
      // ignore parse error and keep fallback message
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function getWallet() {
  const res = await fetch(`${API_BASE}/wallet`);
  if (!res.ok) throw new Error('Unable to load wallet');
  return res.json();
}
