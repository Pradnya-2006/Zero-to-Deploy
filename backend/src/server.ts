import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from './db/connectDB';
import calculateRoute from './routes/calculate';
import resultsRoute from './routes/results';
import goalsRoute from './routes/goals';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
import authMiddleware from './middleware/auth';

// parse JWT (if present) and attach userId to req.userId
app.use(authMiddleware);

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET as string;
const MONGO_URI = process.env.MONGO_URI as string | undefined;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string | undefined;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/* MongoDB */
if (!MONGO_URI) {
  console.warn("MONGO_URI is not set. Skipping MongoDB connection.");
} else {
  connectDB();
}

/* Chat endpoint using Gemini / Generative Language API */
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, messages } = req.body as { message?: string; messages?: Array<{ role: string; content: string }> };

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    let contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    
    contents.push({
      role: "user",
      parts: [{ text: "You are an Eco Assistant helping users understand and reduce their carbon footprint. Be helpful, concise, and encouraging. Focus on practical sustainability tips." }]
    });
    contents.push({
      role: "model", 
      parts: [{ text: "Understood! I'm your Eco Assistant, ready to help you reduce your carbon footprint with practical and actionable advice." }]
    });

    if (Array.isArray(messages) && messages.length) {
      messages.forEach((m) => {
        contents.push({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        });
      });
    } else if (message) {
      contents.push({ role: "user", parts: [{ text: message }] });
    } else {
      return res.status(400).json({ error: "No message provided" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    const body = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("Gemini API error:", txt);
      return res.status(502).json({ error: "Upstream Gemini API error", details: txt });
    }

    const data = await response.json();
    const assistantText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    return res.json({ reply: assistantText });
  } catch (err: any) {
    console.error("/api/chat error", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* User Schema */
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);

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

/* routes */
app.use('/api/calculate', calculateRoute);
app.use('/api/results', resultsRoute);
app.use('/api/goals', goalsRoute);

/* health check */
app.get('/ping', (_, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
