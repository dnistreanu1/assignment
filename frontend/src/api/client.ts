import type { CreateEmailInput, Email } from '../types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function listEmails(): Promise<Email[]> {
  const res = await fetch(`${BACKEND_URL}/emails`);
  if (!res.ok) throw new Error('Failed to list emails');
  return res.json();
}

export async function createEmail(input: CreateEmailInput): Promise<{ id: number }> {
  const res = await fetch(`${BACKEND_URL}/emails`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create email');
  return res.json();
}

export async function deleteAllEmails(): Promise<{ deleted: number }> {
  const res = await fetch(`${BACKEND_URL}/emails`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete emails');
  return res.json();
}

export function streamDraft(prompt: string, onChunk: (chunk: { text?: string; decision?: string; done?: boolean }) => void): () => void {
  const url = new URL(`${BACKEND_URL}/ai/draft`);
  url.searchParams.set('prompt', prompt);
  const es = new EventSource(url.toString());
  es.addEventListener('meta', (e) => {
    try { onChunk({ decision: JSON.parse((e as MessageEvent).data).decision }); } catch {}
  });
  es.addEventListener('message', (e) => {
    try { onChunk(JSON.parse((e as MessageEvent).data)); } catch {}
  });
  es.addEventListener('done', () => {
    onChunk({ done: true });
    es.close();
  });
  es.onerror = () => {
    es.close();
  };
  return () => es.close();
}


