import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export default function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const auth = req.headers?.authorization as string | undefined;
    if (!auth || !auth.startsWith('Bearer ')) return next();

    const token = auth.replace(/^Bearer\s+/i, '');
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // attach user id to request for downstream handlers
    (req as any).userId = payload?.id || payload?.sub || undefined;
  } catch (err) {
    // ignore invalid token and continue as unauthenticated
  }

  return next();
}
