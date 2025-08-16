import { Router } from 'express';
import { generateText, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import "dotenv/config";

export const aiRouter = Router();

type RouterDecision = 'sales' | 'followup';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const decideAssistant = async (prompt: string): Promise<RouterDecision> => {
  const result = await generateText({
    model: openai('gpt-5-nano'),
    system: [
      'You are a strict router. Output exactly one word: sales or followup.',
      'Use followup for any prompt that implies checking in, following up, reminder, or previous message.',
      'Otherwise use sales.',
    ].join('\n'),
    prompt,
    temperature: 0,
  });
  const text = result.text.trim().toLowerCase();
  return text.includes('follow') ? 'followup' : 'sales';
}

function buildSystemPrompt(decision: RouterDecision): string {
  if (decision === 'followup') {
    return [
      'You are a Follow-up Assistant. Generate a polite, concise follow-up email.',
      'Start with: Subject: <short subject>',
      'Then a newline and write the body in under 40 words total, 7–10 words per sentence.',
      'Keep tone courteous. Do not add signatures. Output only subject and body.',
    ].join('\n');
  }
  return [
    'You are a Sales Assistant. Generate a brief, value-focused outreach email.',
    'Start with: Subject: <short subject>',
    'Then a newline and write the body in under 40 words total, 7–10 words per sentence.',
    'Highlight a clear outcome. Do not add signatures. Output only subject and body.',
  ].join('\n');
}

aiRouter.get('/draft', async (req, res) => {
  try {
    const prompt = (req.query.prompt as string) || '';
    if (!prompt) return res.status(400).end('Missing prompt');
    if (!process.env.OPENAI_API_KEY) return res.status(500).end('Missing OPENAI_API_KEY');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const decision = await decideAssistant(prompt);
    console.log('decision', decision)
    res.write(`event: meta\n`);
    res.write(`data: ${JSON.stringify({ decision })}\n\n`);

    const system = buildSystemPrompt(decision);
    const result = streamText({ model: openai('gpt-5-nano'), system, prompt });
    for await (const delta of result.textStream) {
      res.write(`data: ${JSON.stringify({ text: String(delta) })}\n\n`);
    }
    res.write(`event: done\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    res.status(500).end('AI error');
  }
});


