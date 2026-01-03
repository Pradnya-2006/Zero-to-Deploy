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
    // Stored emissions are annual totals; derive per-month by dividing by 12
    const monthlyPipeline = [
      { $match: { ...match, createdAt: { $gte: oneYearAgo } } },
      {
        $project: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          electricityMonthly: { $divide: [ { $ifNull: ['$emissions.electricity', 0] }, 12 ] },
          transportMonthly: { $divide: [ { $ifNull: ['$emissions.transport', 0] }, 12 ] },
          lifestyleMonthly: { $divide: [ { $ifNull: ['$emissions.lifestyle', 0] }, 12 ] },
          totalMonthly: { $divide: [ { $ifNull: ['$emissions.total', { $add: ['$emissions.electricity', '$emissions.transport', '$emissions.lifestyle'] }] }, 12 ] }
        }
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          total: { $sum: '$totalMonthly' },
          electricity: { $sum: '$electricityMonthly' },
          transport: { $sum: '$transportMonthly' },
          lifestyle: { $sum: '$lifestyleMonthly' }
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

    // Weekly aggregation: last 12 weeks (by createdAt) summing per-category and total
    const weeksAgo = new Date();
    // start from beginning of current ISO week
    const curr = new Date();
    const startOfWeek = new Date(curr);
    // set to Monday of current week (ISO week start)
    const day = (startOfWeek.getDay() + 6) % 7; // 0=Mon..6=Sun
    startOfWeek.setDate(startOfWeek.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);
    const twelveWeeksAgo = new Date(startOfWeek);
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - (11 * 7));

    // Weekly aggregation: last 12 weeks (by createdAt) summing per-category and total
    // Derive per-week contributions from stored annual totals (/52)
    const weeklyPipeline = [
      { $match: { ...match, createdAt: { $gte: twelveWeeksAgo } } },
      {
        $project: {
          isoWeek: { $isoWeek: '$createdAt' },
          isoWeekYear: { $isoWeekYear: '$createdAt' },
          electricityWeekly: { $divide: [ { $ifNull: ['$emissions.electricity', 0] }, 52 ] },
          transportWeekly: { $divide: [ { $ifNull: ['$emissions.transport', 0] }, 52 ] },
          lifestyleWeekly: { $divide: [ { $ifNull: ['$emissions.lifestyle', 0] }, 52 ] },
          totalWeekly: { $divide: [ { $ifNull: ['$emissions.total', { $add: ['$emissions.electricity', '$emissions.transport', '$emissions.lifestyle'] }] }, 52 ] }
        }
      },
      {
        $group: {
          _id: { year: '$isoWeekYear', week: '$isoWeek' },
          total: { $sum: '$totalWeekly' },
          electricity: { $sum: '$electricityWeekly' },
          transport: { $sum: '$transportWeekly' },
          lifestyle: { $sum: '$lifestyleWeekly' }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ];

    const weeklyAgg = await CarbonResult.aggregate(weeklyPipeline as any).exec();

    // Build last 12 weeks array with zeros for missing weeks
    const weeks: Array<{ year: number; week: number; total: number; electricity: number; transport: number; lifestyle: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() - i * 7);
      weeks.push({ year: getISOWeekYear(d), week: getISOWeekNumber(d), total: 0, electricity: 0, transport: 0, lifestyle: 0 });
    }

    weeklyAgg.forEach((w: any) => {
      const year = w._id.year;
      const week = w._id.week;
      const idx = weeks.findIndex((x) => x.year === year && x.week === week);
      if (idx !== -1) {
        weeks[idx].total = w.total || 0;
        weeks[idx].electricity = w.electricity || 0;
        weeks[idx].transport = w.transport || 0;
        weeks[idx].lifestyle = w.lifestyle || 0;
      }
    });

    const yearly = yearlyAgg.map((y: any) => ({ year: y._id, total: y.total, electricity: y.electricity || 0, transport: y.transport || 0, lifestyle: y.lifestyle || 0 }));

    return res.status(200).json({ weekly: weeks, monthly: months, yearly });
  } catch (err: any) {
    console.error('/api/results/history error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});
// helper to compute ISO week number
function getISOWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((date as any) - (yearStart as any)) / 86400000 + 1) / 7);
  return weekNo;
}

function getISOWeekYear(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  return date.getUTCFullYear();
}
export default router;
