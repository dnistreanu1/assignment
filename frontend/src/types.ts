export type Email = {
  id: number;
  to: string;
  cc: string | null;
  bcc: string | null;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type CreateEmailInput = {
  to: string;
  cc?: string | null;
  bcc?: string | null;
  subject: string;
  body: string;
};


