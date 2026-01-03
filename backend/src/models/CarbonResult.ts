import mongoose, { Schema, Document } from 'mongoose';

export interface ICarbonResult extends Document {
  userId: string;
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
  userId: { type: String, required: true },
  inputs: { type: Schema.Types.Mixed, required: true },
  emissions: {
    electricity: Number,
    transport: Number,
    lifestyle: Number,
    total: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICarbonResult>(
  'CarbonResult',
  CarbonResultSchema
);
