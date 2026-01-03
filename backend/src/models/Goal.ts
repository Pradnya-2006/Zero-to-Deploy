import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // absolute target in kg CO2 (monthly)
  targetKgCO2: { type: Number, required: true },
  // whether the user specified a percentage or absolute target
  targetType: { type: String, enum: ['percentage', 'absolute'], default: 'absolute' },
  // timeframe for the goal (monthly for now)
  timeframe: { type: String, enum: ['monthly'], default: 'monthly' },
  // original user-supplied target value when targetType === 'percentage' this is the percent
  targetValueRaw: { type: Number },
  unit: { type: String, default: 'kg CO₂' },
  endDate: { type: Date },
  // category for the goal (which emissions category it targets)
  category: { type: String, enum: ['electricity', 'transport', 'lifestyle', 'general'], default: 'general' },
  description: { type: String },
  // baseline monthly value captured when goal was created
  baselineKgCO2: { type: Number, default: 0 },
  // latest observed current monthly value
  currentValue: { type: Number, default: 0 },
  // progress percent 0-100
  progressPercent: { type: Number, default: 0 },
  achieved: { type: Boolean, default: false },
  achievedAt: { type: Date },
  // status: active | achieved | missed
  status: { type: String, enum: ['active', 'achieved', 'missed'], default: 'active' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  startDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const Goal = mongoose.model('Goal', GoalSchema);

export default Goal;
