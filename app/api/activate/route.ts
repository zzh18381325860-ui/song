import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';

// 定义激活码在数据库中存储的结构类型，方便代码提示和检查
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

    // 【关键变化 1】直接使用用户输入的 code 作为 key，不再添加任何前缀
    const key = code;
    
    // 从 KV 中获取的是一个 JSON 字符串，或者 null
    const storedCodeString: string | null = await kv.get(key);

    if (storedCodeString === null) {
      // 数据库中完全找不到这个 key，说明激活码无效
      return NextResponse.json({ message: '激活码无效' }, { status: 404 });
    }

    // 将获取到的 JSON 字符串解析成对象
    let storedCodeInfo: ActivationCodeInfo;
    try {
      storedCodeInfo = JSON.parse(storedCodeString);
    } catch (e) {
      console.error('解析数据库中的激活码数据失败:', e);
      return NextResponse.json({ message: '激活码数据格式错误' }, { status: 500 });
    }

    // 【关键变化 2】检查使用次数是否已达上限
    if (storedCodeInfo.usedBy.length >= storedCodeInfo.totalUses) {
      console.log(`激活码 ${code} 已达到使用上限 ${storedCodeInfo.totalUses} 次。`);
      return NextResponse.json({ message: '此激活码的使用次数已耗尽' }, { status: 403 });
    }

    // --- 验证通过，开始创建会话 ---

    // 1. 生成一个新的、唯一的会话 ID
    const sessionId = crypto.randomUUID();
    const sessionKey = `session:${sessionId}`;

    // 2. 更新激活码信息，将新的 sessionId 添加到 usedBy 数组中
    const updatedCodeInfo: ActivationCodeInfo = {
      ...storedCodeInfo,
      usedBy: [...storedCodeInfo.usedBy, sessionId],
    };

    // 3. 使用 pipeline 保证原子操作，同时更新两项数据
    const pipeline = kv.pipeline();
    // 写入新的会话，有效期30天
    pipeline.set(sessionKey, { activatedWithCode: code }, { ex: 60 * 60 * 24 * 30 });
    // 更新激活码的使用记录
    pipeline.set(key, JSON.stringify(updatedCodeInfo));
    await pipeline.exec();

    console.log(`激活成功！激活码 ${code} 已被使用，为用户创建了 session: ${sessionId}`);

    // 4. 在用户浏览器中设置 cookie
    cookies().set('auth_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      // domain 设置保持不变
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
