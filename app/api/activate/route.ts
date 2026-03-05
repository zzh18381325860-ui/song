import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// 明确告诉 Vercel 在 Edge Runtime 环境中运行此 API
export const runtime = 'edge';

// 定义激活码在数据库中存储的结构类型
interface ActivationCodeInfo {
  totalUses: number;
  usedBy: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ message: '激活码格式不正确' }, { status: 400 });
    }

    const key = code;
    
    const storedCodeInfo: ActivationCodeInfo | null = await kv.get(key);

    if (storedCodeInfo === null) {
      return NextResponse.json({ message: '激活码无效' }, { status: 404 });
    }

    if (storedCodeInfo.usedBy.length >= storedCodeInfo.totalUses) {
      return NextResponse.json({ message: '此激活码的使用次数已耗尽' }, { status: 403 });
    }

    const sessionId = crypto.randomUUID();
    const sessionKey = `session:${sessionId}`;

    const updatedCodeInfo: ActivationCodeInfo = {
      ...storedCodeInfo,
      usedBy: [...storedCodeInfo.usedBy, sessionId],
    };

    const pipeline = kv.pipeline();
    // 注意：这里是数据库中 session 记录的有效期，可以保持长一点，没关系
    pipeline.set(sessionKey, { activatedWithCode: code }, { ex: 60 * 60 * 24 * 30 });
    pipeline.set(key, updatedCodeInfo);
    await pipeline.exec();

    // 1. 创建一个成功的响应对象
    const response = NextResponse.json({ success: true });

    // 2. 在这个响应对象上设置 cookie
    response.cookies.set('auth_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      // 【【【 方案二修改点 】】】
      // 设置 Cookie 在 5 分钟后过期
      maxAge: 60 * 5, 
      domain: process.env.VERCEL_ENV === 'production' 
        ? '.song-one-sage.xyz' 
        : undefined
    });

    // 3. 返回这个带有 cookie 的响应
    return response;

  } catch (error) {
    console.error('激活 API 出错:', error);
    return NextResponse.json({ message: '服务器内部错误，请联系管理员' }, { status: 500 });
  }
}
