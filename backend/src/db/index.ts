import knexFactory from 'knex';

export const knex = knexFactory({
  client: 'sqlite3',
  connection: {
    filename: './data/dev.sqlite3',
  },
  useNullAsDefault: true,
});

export interface Email {
  id: number;
  to: string;
  cc: string | null;
  bcc: string | null;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmailInput {
  to: string;
  cc?: string | null;
  bcc?: string | null;
  subject: string;
  body: string;
}

export async function insertEmail(data: CreateEmailInput): Promise<number> {
  const ids = await knex('emails').insert({
    to: data.to,
    cc: data.cc ?? null,
    bcc: data.bcc ?? null,
    subject: data.subject,
    body: data.body,
  });
  return Array.isArray(ids) ? Number(ids[0]) : Number(ids);
}

export async function listEmails(): Promise<Email[]> {
  return knex<Email>('emails').select('*').orderBy('created_at', 'desc');
}

export async function getEmail(id: number): Promise<Email | undefined> {
  return knex<Email>('emails').where({ id }).first();
}

export async function deleteAllEmails(): Promise<number> {
  return knex<Email>('emails').del();
}


