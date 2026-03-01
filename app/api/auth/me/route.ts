import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    return NextResponse.json({
      user: {
        username: decoded.username,
        role: decoded.role,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: '无效的token' }, { status: 401 });
  }
}