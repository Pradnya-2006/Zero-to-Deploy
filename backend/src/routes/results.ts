import express, { Request, Response } from 'express';
import CarbonResult from '../models/CarbonResult';

const router = express.Router();

// GET /api/results/latest?userId=...
router.get('/latest', async (req: Request, res: Response) => {
  try {
    // Prefer authenticated user id (from JWT). Fall back to query param for compatibility.
    const userId = (req as any).userId as string | undefined || (req.query.userId as string | undefined);

    const query = userId ? { userId } : {};

    const latest = await CarbonResult.find(query).sort({ createdAt: -1 }).limit(1).lean();

    if (!latest || latest.length === 0) {
      return res.status(200).json({ found: false, result: null });
    }

    return res.status(200).json({ found: true, result: latest[0] });
  } catch (err: any) {
    console.error('/api/results/latest error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
