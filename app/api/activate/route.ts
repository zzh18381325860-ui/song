import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';

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
    
    // 【重大修正】kv.get 会自动解析 JSON，所以我们直接获取对象！
    // 不再需要 JSON.parse()
    const storedCodeInfo: ActivationCodeInfo | null = await kv.get(key);

    if (storedCodeInfo === null) {
      return NextResponse.json({ message: '激活码无效' }, { status: 404 });
    }

    // 【重大修正】因为上面已经拿到了对象，所以不再需要 try-catch 解析块
    // 直接进行逻辑判断
    if (storedCodeInfo.usedBy.length >= storedCodeInfo.totalUses) {
      console.log(`激活码 ${code} 已达到使用上限 ${storedCodeInfo.totalUses} 次。`);
      return NextResponse.json({ message: '此激活码的使用次数已耗尽' }, { status: 403 });
    }

    // --- 验证通过，开始创建会话 ---

    const sessionId = crypto.randomUUID();
    const sessionKey = `session:${sessionId}`;

    const updatedCodeInfo: ActivationCodeInfo = {
      ...storedCodeInfo,
      usedBy: [...storedCodeInfo.usedBy, sessionId],
    };

    const pipeline = kv.pipeline();
    pipeline.set(sessionKey, { activatedWithCode: code }, { ex: 60 * 60 * 24 * 30 });
    
    // 【优化】kv.set 也能自动处理对象，无需手动 stringify
    pipeline.set(key, updatedCodeInfo);
    
    await pipeline.exec();

    console.log(`激活成功！激活码 ${code} 已被使用，为用户创建了 session: ${sessionId}`);

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
// 这里的通用错误信息只会在意想不到的情况下触发
return NextResponse.json({ message: '服务器内部错误' }, { status: 500 });
}
}
