import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';
// import { v4 as uuidv4 } from 'uuid'; // <--- 【修改】删除这一行，我们不再需要它了

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ message: '激活码不能为空' }, { status: 400 });
    }

    const key = `code:${code}`;
    const storedCode: { usedBy: string[] } | null = await kv.get(key);

    if (!storedCode) {
      return NextResponse.json({ message: '激活码无效' }, { status: 404 });
    }

    if (storedCode.usedBy && storedCode.usedBy.length > 0) {
      console.log(`激活码 ${code} 已被使用，使用者ID:`, storedCode.usedBy);
      return NextResponse.json({ message: '此激活码已被使用' }, { status: 403 });
    }

    // 【修改】使用内置的 crypto API 生成一个唯一的会话ID，效果和 uuid 一样
    const sessionId = crypto.randomUUID(); 
    
    const sessionKey = `session:${sessionId}`;

    const pipeline = kv.pipeline();
    pipeline.set(sessionKey, { activatedWithCode: code }, { ex: 60 * 60 * 24 * 30 });
    pipeline.set(key, { ...storedCode, usedBy: [sessionId] });
    await pipeline.exec();

    console.log(`激活成功！为用户创建了 session: ${sessionId}`);

    cookies().set('auth_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      domain: process.env.VERCEL_ENV === 'production' 
        ? '.song-one-sage.xyz' 
        : undefined
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('激活 API 出错:', error);
    return NextResponse.json({ message: '服务器内部错误' }, { status: 500 });
  }
}
