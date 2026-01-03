import express, { Request, Response } from 'express';
import Goal from '../models/Goal';
import CarbonResult from '../models/CarbonResult';

const router = express.Router();

// Create a new goal
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      targetValue,
      targetType = 'absolute',
      timeframe = 'monthly',
      startDate,
      endDate,
      category = 'general',
      description,
      currentValue,
    } = req.body;

    if (!title || typeof targetValue === 'undefined' || typeof currentValue === 'undefined' || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields: title, currentValue, targetValue, startDate, endDate' });
    }

    const userId = (req as any).userId as string | undefined;

    // validate current > target (user must provide baseline higher than target)
    const cur = Number(currentValue);
    let targetKg = 0;
    if (targetType === 'percentage') {
      // interpret targetValue as percent reduction from current
      targetKg = cur * (1 - Number(targetValue) / 100);
    } else {
      targetKg = Number(targetValue);
    }

    if (!(cur > targetKg)) {
      return res.status(400).json({ message: 'Invalid values: currentValue must be greater than targetValue' });
    }

    const goal = await Goal.create({
      title,
      targetKgCO2: targetKg,
      targetType,
      timeframe,
      targetValueRaw: Number(targetValue),
      unit: 'kg CO₂',
      endDate: endDate ? new Date(endDate) : undefined,
      category,
      description,
      baselineKgCO2: cur,
      currentValue: cur,
      progressPercent: 0,
      userId,
      startDate: startDate ? new Date(startDate) : new Date(),
      status: 'active',
    });

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

// Update goal fields (manual update, does not auto-complete)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = (req as any).userId as string | undefined;
    const { currentValue, startDate, endDate, title, description, category } = req.body;

    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (userId && String(goal.userId) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });

    if (typeof currentValue !== 'undefined') goal.currentValue = Number(currentValue);
    if (startDate) goal.startDate = new Date(startDate);
    if (endDate) goal.endDate = new Date(endDate);
    if (title) goal.title = title;
    if (description) goal.description = description;
    if (category) goal.category = category;

    // Do not auto-mark achieved here; keep manual flow
    // Recompute a simple progress percent relative to baseline and target
    const baseline = Number(goal.baselineKgCO2 || 0);
    const target = Number(goal.targetKgCO2 || 0);
    const current = Number(goal.currentValue || 0);
    if (baseline > target) {
      const denom = baseline - target;
      goal.progressPercent = Math.max(0, Math.min(100, Math.round(((baseline - current) / denom) * 100)));
    }

    await goal.save();
    return res.json(goal);
  } catch (err: any) {
    console.error('PATCH /api/goals/:id error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Mark a goal as completed (manual tick)
router.patch('/:id/complete', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = (req as any).userId as string | undefined;

    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (userId && String(goal.userId) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });

    // Manual completion by the user: mark as achieved and set progress to 100%
    const now = new Date();
    goal.status = 'achieved';
    goal.achieved = true;
    goal.achievedAt = now;
    goal.progressPercent = 100;

    await goal.save();
    return res.json(goal);
  } catch (err: any) {
    console.error('PATCH /api/goals/:id/complete error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete a goal
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = (req as any).userId as string | undefined;

    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (userId && String(goal.userId) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });

    await Goal.deleteOne({ _id: id });
    return res.json({ success: true });
  } catch (err: any) {
    console.error('DELETE /api/goals/:id error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
