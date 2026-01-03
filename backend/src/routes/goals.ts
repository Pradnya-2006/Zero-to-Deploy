import express, { Request, Response } from 'express';
import Goal from '../models/Goal';

const router = express.Router();

// Create a new goal
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, targetKgCO2, unit, deadline, currentValue } = req.body;

    if (!title || typeof targetKgCO2 === 'undefined') {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userId = (req as any).userId as string | undefined;

    const goal = await Goal.create({ title, targetKgCO2, unit, deadline, currentValue, userId });
    return res.status(201).json(goal);
  } catch (err: any) {
    console.error('POST /api/goals error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// List goals
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string | undefined || (req.query.userId as string | undefined);
    const query = userId ? { userId } : {};
    const goals = await Goal.find(query).sort({ createdAt: -1 }).lean();
    return res.json(goals);
  } catch (err: any) {
    console.error('GET /api/goals error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
