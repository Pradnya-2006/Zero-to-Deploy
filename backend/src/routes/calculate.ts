import express, { Request, Response } from 'express';
import CarbonResult from '../models/CarbonResult';
import { calculateFootprint } from '../services/calculateFootprint';
import { getISOWeek } from '../utils/getWeek';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const emissions = calculateFootprint(req.body);

    const userId =
      (req as any).userId ??
      req.body.userId ??
      'anonymous';

    const { week, year } = getISOWeek();

    const existing = await CarbonResult.findOne({
      userId,
      week,
      year,
    });

    let saved;

    if (existing) {
      existing.inputs = req.body;
      existing.emissions = emissions;
      saved = await existing.save();
    } else {
      saved = await CarbonResult.create({
        userId,
        week,
        year,
        inputs: req.body,
        emissions,
      });
    }

    res.status(200).json({
      success: true,
      updated: !!existing,
      week,
      year,
      emissions,
    });
  } catch (error: any) {
    console.error('❌ CALCULATION FAILED:', error);

    res.status(500).json({
      success: false,
      message: 'Calculation failed',
      error: error?.message,
    });
  }
});

export default router;
