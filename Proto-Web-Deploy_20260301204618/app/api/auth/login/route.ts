import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // 验证用户名和密码
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    if (username !== adminUsername) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    // 简单密码验证（生产环境建议使用哈希密码）
    if (password !== adminPassword) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    // 生成JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // 设置cookie
    const response = NextResponse.json({ 
      success: true, 
      message: '登录成功',
      user: { username, role: 'admin' }
    });

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24小时
    });

    return response;
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}