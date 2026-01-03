import express, { Request, Response } from 'express';
import CarbonResult from '../models/CarbonResult';
import { calculateFootprint } from '../services/calculateFootprint';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  console.log('🔥 /api/calculate HIT');
  console.log('BODY:', req.body);

  try {
    const emissions = calculateFootprint(req.body);

    const saved = await CarbonResult.create({
      userId: req.body.userId ?? 'anonymous',
      inputs: req.body,
      emissions,
    });

    console.log('✅ Saved document ID:', saved._id);

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
