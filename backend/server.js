// server.js
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';

// If your routes are compiled to JS, require the routes; otherwise use src/server.ts via ts-node
let calculateRouter;
try {
  calculateRouter = require('./src/routes/calculate').default || require('./src/routes/calculate');
} catch (e) {
  // fallback: if routes are in ./routes or compiled elsewhere, adjust path
  console.warn('Could not load ./src/routes/calculate; adjust path if using compiled JS');
}

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

if (calculateRouter) app.use('/api', calculateRouter);

// root healthcheck
app.get('/', (_req, res) => res.send('Backend running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
