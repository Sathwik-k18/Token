'use client';
import { useState } from 'react';
import { sendMessage } from '../../services/api/chatApi';

export function ChatWindow() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [usage, setUsage] = useState<any>(null);

  async function onSend() {
    const res = await sendMessage(prompt);
    setReply(res.content);
    setUsage(res.usage);
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ minHeight: 120, background: '#1e293b', color: '#e2e8f0' }} />
      <button onClick={onSend}>Send</button>
      <pre>{reply}</pre>
      {usage && <small>Input: {usage.input_tokens} | Output: {usage.output_tokens}</small>}
    </div>
  );
}
