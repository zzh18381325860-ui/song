import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';

// 【【【 决定性的一行代码 】】】
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
    
    // kv.get 会自动解析 JSON，直接接收对象
    const storedCodeInfo: ActivationCodeInfo | null = await kv.get(key);

    if (storedCodeInfo === null) {
      return NextResponse.json({ message: '激活码无效' }, { status: 404 });
    }

    // 直接对获取到的对象进行逻辑判断
    if (storedCodeInfo.usedBy.length >= storedCodeInfo.totalUses) {
      return NextResponse.json({ message: '此激活码的使用次数已耗尽' }, { status: 403 });
    }

    // --- 验证通过，开始创建会话 ---

    const sessionId = crypto.randomUUID();
    const sessionKey = `session:${sessionId}`;

    const updatedCodeInfo: ActivationCodeInfo = {
      ...storedCodeInfo,
      usedBy: [...storedCodeInfo.usedBy, sessionId],
    };

    // 使用 pipeline 保证原子操作
    const pipeline = kv.pipeline();
    pipeline.set(sessionKey, { activatedWithCode: code }, { ex: 60 * 60 * 24 * 30 });
    pipeline.set(key, updatedCodeInfo); // kv.set 也能自动处理对象
    await pipeline.exec();

    // 在用户浏览器中设置 cookie
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
    // 这个 catch 块现在只会在发生意想不到的严重错误时触发
    return NextResponse.json({ message: '服务器内部错误，请联系管理员' }, { status: 500 });
  }
}
