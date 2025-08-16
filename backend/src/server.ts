import express from 'express';
import cors from 'cors';
import { emailsRouter } from './routes/emails.route';
import { aiRouter } from './routes/ai.route';
import "dotenv/config";

const app = express();

app.use(
  cors({
    origin: process.env.SERVER_FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  }),
);
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.use('/emails', emailsRouter);
app.use('/ai', aiRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => {
  console.log(`Backend listening on: http://localhost:${port}`);
});


