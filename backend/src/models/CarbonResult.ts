import mongoose, { Schema, Document } from 'mongoose';

export interface ICarbonResult extends Document {
  userId: string;
  week: number;
  year: number;
  inputs: any;
  emissions: {
    electricity: number;
    transport: number;
    lifestyle: number;
    total: number;
  };
  createdAt: Date;
}

const CarbonResultSchema = new Schema<ICarbonResult>({
  userId: { type: String, required: true, index: true },
  week: { type: Number, required: true },
  year: { type: Number, required: true },

  inputs: { type: Schema.Types.Mixed, required: true },

  emissions: {
    electricity: Number,
    transport: Number,
    lifestyle: Number,
    total: Number,
  },

  createdAt: { type: Date, default: Date.now },
});

/* prevent duplicate weekly entries */
CarbonResultSchema.index(
  { userId: 1, week: 1, year: 1 },
  { unique: true }
);

export default mongoose.model<ICarbonResult>(
  'CarbonResult',
  CarbonResultSchema
);
