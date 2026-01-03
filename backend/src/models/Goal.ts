import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  targetKgCO2: { type: Number, required: true },
  unit: { type: String, default: 'kg CO₂' },
  deadline: { type: String },
  currentValue: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
});

const Goal = mongoose.model('Goal', GoalSchema);

export default Goal;
