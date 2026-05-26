'use client';
import { useState } from 'react';
import { sendMessage } from '../../services/api/chatApi';

export function ChatWindow() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [usage, setUsage] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSend() {
    setError('');
    setLoading(true);
    try {
      const res = await sendMessage(prompt);
      setReply(res.content);
      setUsage(res.usage);
    } catch (err: any) {
      setError(err?.message || 'Unable to send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ minHeight: 120, background: '#1e293b', color: '#e2e8f0' }} />
      <button onClick={onSend} disabled={loading || !prompt.trim()}>{loading ? 'Sending...' : 'Send'}</button>
      {error && <p style={{ color: '#f87171' }}>{error}</p>}
      <pre>{reply}</pre>
      {usage && <small>Input: {usage.input_tokens} | Output: {usage.output_tokens}</small>}
    </div>
  );
}
