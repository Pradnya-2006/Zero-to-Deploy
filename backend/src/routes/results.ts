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

// GET /api/results/history - returns monthly (last 12 months) and yearly totals for the authenticated user
router.get('/history', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string | undefined || (req.query.userId as string | undefined);

    const match: any = {};
    if (userId) match.userId = userId;

    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear(), now.getMonth(), 1);
    oneYearAgo.setMonth(oneYearAgo.getMonth() - 11); // start of month 11 months ago -> gives 12 months window

    // Monthly aggregation: last 12 months (by createdAt) summing per-category and total
    const monthlyPipeline = [
      { $match: { ...match, createdAt: { $gte: oneYearAgo } } },
      {
        $project: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          electricity: { $ifNull: ['$emissions.electricity', 0] },
          transport: { $ifNull: ['$emissions.transport', 0] },
          lifestyle: { $ifNull: ['$emissions.lifestyle', 0] },
          total: {
            $ifNull: ['$emissions.total', { $add: ['$emissions.electricity', '$emissions.transport', '$emissions.lifestyle'] }]
          }
        }
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          total: { $sum: '$total' },
          electricity: { $sum: '$electricity' },
          transport: { $sum: '$transport' },
          lifestyle: { $sum: '$lifestyle' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ];

    const monthlyAgg = await CarbonResult.aggregate(monthlyPipeline as any).exec();

    // Build last 12 months array with zeros for missing months
    const months: Array<{ year: number; month: number; total: number; electricity: number; transport: number; lifestyle: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1, total: 0, electricity: 0, transport: 0, lifestyle: 0 });
    }

    monthlyAgg.forEach((m: any) => {
      const year = m._id.year;
      const month = m._id.month;
      const idx = months.findIndex((x) => x.year === year && x.month === month);
      if (idx !== -1) {
        months[idx].total = m.total || 0;
        months[idx].electricity = m.electricity || 0;
        months[idx].transport = m.transport || 0;
        months[idx].lifestyle = m.lifestyle || 0;
      }
    });

    // Yearly aggregation: last 5 years
    const fiveYearsAgo = new Date(now.getFullYear() - 4, 0, 1);
    const yearlyPipeline = [
      { $match: { ...match, createdAt: { $gte: fiveYearsAgo } } },
      {
        $project: {
          year: { $year: '$createdAt' },
          electricity: { $ifNull: ['$emissions.electricity', 0] },
          transport: { $ifNull: ['$emissions.transport', 0] },
          lifestyle: { $ifNull: ['$emissions.lifestyle', 0] },
          total: {
            $ifNull: ['$emissions.total', { $add: ['$emissions.electricity', '$emissions.transport', '$emissions.lifestyle'] }]
          }
        }
      },
      {
        $group: {
          _id: '$year',
          total: { $sum: '$total' },
          electricity: { $sum: '$electricity' },
          transport: { $sum: '$transport' },
          lifestyle: { $sum: '$lifestyle' }
        }
      },
      { $sort: { '_id': 1 } }
    ];

    const yearlyAgg = await CarbonResult.aggregate(yearlyPipeline as any).exec();

    const yearly = yearlyAgg.map((y: any) => ({ year: y._id, total: y.total, electricity: y.electricity || 0, transport: y.transport || 0, lifestyle: y.lifestyle || 0 }));

    return res.status(200).json({ monthly: months, yearly });
  } catch (err: any) {
    console.error('/api/results/history error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});
export default router;
