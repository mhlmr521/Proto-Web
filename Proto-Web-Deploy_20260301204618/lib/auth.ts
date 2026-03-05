import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function verifyToken(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    throw new Error('未授权访问');
  }
  return user;
}