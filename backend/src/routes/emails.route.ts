import { Router } from 'express';
import { CreateEmailInput, deleteAllEmails, getEmail, insertEmail, listEmails } from '../db';

export const emailsRouter = Router();

emailsRouter.get('/', async (_req, res) => {
  const emails = await listEmails();
  res.json(emails);
});

emailsRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const email = await getEmail(id);
  if (!email) return res.status(404).json({ error: 'Not found' });
  res.json(email);
});

emailsRouter.post('/', async (req, res) => {
  const body: CreateEmailInput = req.body;
  if (!body?.to || !body?.subject || !body?.body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = await insertEmail(body);
  res.status(201).json({ id });
});

emailsRouter.delete('/', async (_req, res) => {
  const deleted = await deleteAllEmails();
  res.status(200).json({ deleted });
});


