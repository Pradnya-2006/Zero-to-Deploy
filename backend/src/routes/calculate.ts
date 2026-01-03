import express, { Request, Response } from 'express';
import CarbonResult from '../models/CarbonResult';
import { calculateFootprint } from '../services/calculateFootprint';
import Goal from '../models/Goal';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  console.log('🔥 /api/calculate HIT');
  console.log('BODY:', req.body);

  try {
    const emissions = calculateFootprint(req.body);

    const userIdFromReq = (req as any).userId as string | undefined;

    const saved = await CarbonResult.create({
      userId: userIdFromReq ?? req.body.userId ?? 'anonymous',
      inputs: req.body,
      emissions,
    });

    console.log('✅ Saved document ID:', saved._id);
    // Do not auto-update goals here; goal updates are manual/tick-based per user request.

    //res.json({ emissions });
    res.status(200).json({
      success: true,
      emissions,
    });

  } catch (error: any) {
    console.error('❌ SAVE FAILED FULL ERROR:', error);

    res.status(500).json({
      message: 'Calculation failed',
      error: error?.message,
    });
  }
});

export default router;
