import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

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

    // 注意：这里检查的是 usedBy 数组是否存在且长度大于0
    if (storedCode.usedBy && storedCode.usedBy.length > 0) {
      // 这里的日志可以看到 usedBy 的值，方便调试
      console.log(`激活码 ${code} 已被使用，使用者ID:`, storedCode.usedBy);
      return NextResponse.json({ message: '此激活码已被使用' }, { status: 403 });
    }

    // 生成一个独一无二的会话ID (Session ID)
    const sessionId = uuidv4();
    // 【关键】这就是我们要在数据库里存的“通行证”的键名
    const sessionKey = `session:${sessionId}`;

    const pipeline = kv.pipeline();
    // 在 KV 中创建“通行证”，键是 sessionKey，值为一个包含原始激活码的对象，有效期30天
    pipeline.set(sessionKey, { activatedWithCode: code }, { ex: 60 * 60 * 24 * 30 });
    // 更新激活码记录，标记它已经被这个 sessionID 使用了
    pipeline.set(key, { ...storedCode, usedBy: [sessionId] });
    await pipeline.exec();

    console.log(`激活成功！为用户创建了 session: ${sessionId}`);

    // 【关键】将 sessionID 设置到浏览器的 Cookie 中
    cookies().set('auth_session', sessionId, {
      httpOnly: true, // 防止客户端JS脚本读取，更安全
      secure: process.env.NODE_ENV === 'production', // 仅在生产环境的HTTPS下发送
      path: '/', // Cookie 在整个网站都可用
      sameSite: 'lax', // 防止CSRF攻击
      maxAge: 60 * 60 * 24 * 30, // Cookie有效期30天，与KV中的记录保持一致
      // 【关键】明确指定主域名，确保 www 子域和根域都能共享此Cookie
      domain: process.env.VERCEL_ENV === 'production' 
        ? '.song-one-sage.xyz' // 注意前面的点.
        : undefined // 在本地开发时 (localhost)，不需要设置 domain
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('激活 API 出错:', error);
    return NextResponse.json({ message: '服务器内部错误' }, { status: 500 });
  }
}
