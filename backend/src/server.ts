import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET as string;
const MONGO_URI = process.env.MONGO_URI as string;

/* MongoDB */
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

/* User Schema */
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);

/* Goal Schema */
const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  targetKgCO2: { type: Number, required: true },
  currentValue: { type: Number },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Goal = mongoose.model('Goal', GoalSchema);

/* LIST GOALS */
app.get('/api/goals', async (req: Request, res: Response) => {
  try {
    const docs = await Goal.find().sort({ createdAt: -1 }).lean();

    const goals = docs.map((g: any) => ({
      _id: g._id,
      title: g.title,
      targetKgCO2: g.targetKgCO2,
      // provide a fallback currentValue if not stored in DB (default to target so new goals don't worsen progress immediately)
      currentValue: typeof g.currentValue !== 'undefined' && g.currentValue !== null ? g.currentValue : g.targetKgCO2,
      deadline: g.deadline,
      createdAt: g.createdAt,
    }));

    res.json(goals);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err?.message || 'Server error' });
  }
});

/* UPDATE GOAL (partial) */
app.patch('/api/goals/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update: any = {};
    const { title, targetKgCO2, currentValue, deadline } = req.body;

    if (typeof title !== 'undefined') update.title = title;
    if (typeof targetKgCO2 !== 'undefined') update.targetKgCO2 = Number(targetKgCO2);
    if (typeof currentValue !== 'undefined') update.currentValue = Number(currentValue);
    if (typeof deadline !== 'undefined') {
      const d = new Date(deadline);
      if (!isNaN(d.getTime())) update.deadline = d;
    }

    const goal = await Goal.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    res.json(goal);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err?.message || 'Server error' });
  }
});

/* CREATE GOAL */
app.post('/api/goals', async (req: Request, res: Response) => {
  try {
    const { title, targetKgCO2, deadline } = req.body;

    if (!title || typeof targetKgCO2 === 'undefined') {
      return res.status(400).json({ message: 'Missing required fields: title and targetKgCO2' });
    }

    const { currentValue } = req.body;

    const goalData: any = {
      title,
      targetKgCO2: Number(targetKgCO2),
    };

    if (typeof currentValue !== 'undefined') {
      goalData.currentValue = Number(currentValue);
    }

    if (deadline) {
      const d = new Date(deadline);
      if (!isNaN(d.getTime())) goalData.deadline = d;
    }

    const goal = await Goal.create(goalData);

    res.status(201).json(goal);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err?.message || 'Server error' });
  }
});

/* SIGNUP */
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, email, password: hashedPassword });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

  res.json({ message: "Account created successfully", 
            token , 
            user: {
              id: user._id,
              fullName: user.fullName,
              email: user.email,
            },
          });
});

/* LOGIN */
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password as string);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
