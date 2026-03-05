import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers'; // 需要从 cookies 中读取设备ID

export const runtime = 'edge';

// 定义设备ID Cookie的名称和超长有效期（1年）
const DEVICE_COOKIE_NAME = 'device_fingerprint';
const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// 这只是一个类型“蓝图”，告诉代码我们期望从KV数据库拿到的JSON是什么样的。
// 它会自动匹配你数据库中现有的 totalUses 和 usedBy 字段。
interface ActivationCodeInfo {
  totalUses: number;
  usedBy: string[];
  boundDeviceId: string | null; // 这是我们将要新增的字段
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ message: '激活码格式不正确' }, { status: 400 });
    }

    const key = code;
    
    // 1. 从浏览器发来的请求中，尝试读取它的“设备身份证”
    const deviceIdFromCookie = cookies().get(DEVICE_COOKIE_NAME)?.value;

    // 2. 从Vercel KV中根据激活码(key)获取JSON数据。
    // kv.get() 会自动将JSON字符串解析成一个对象。
    const storedCodeInfo: ActivationCodeInfo | null = await kv.get(key);

    if (storedCodeInfo === null) {
      return NextResponse.json({ message: '激活码无效' }, { status: 404 });
    }

    // 3. 核心设备绑定逻辑判断
    // 检查这个激活码的JSON数据中，是否已经有了 boundDeviceId 字段
    if (storedCodeInfo.boundDeviceId) {
      // 如果有，说明码已被绑定。检查当前设备的“身份证”是否匹配。
      if (storedCodeInfo.boundDeviceId !== deviceIdFromCookie) {
        // 不匹配，拒绝激活。
        return NextResponse.json({ message: '此激活码已被另一台设备绑定' }, { status: 403 });
      }
      // 如果匹配，说明是老设备，就继续往下走，检查次数等。
    }
    
    // 4. 检查使用次数（无论是否绑定设备，都要检查）
    if (storedCodeInfo.usedBy.length >= storedCodeInfo.totalUses) {
      return NextResponse.json({ message: '此激活码的使用次数已耗尽' }, { status: 403 });
    }

    // --- 所有验证通过，开始执行激活操作 ---

    const sessionId = crypto.randomUUID();
    const sessionKey = `session:${sessionId}`;
    let newDeviceId: string | null = null;

    // 准备要写回数据库的新JSON数据
    const updatedCodeInfo: ActivationCodeInfo = {
      ...storedCodeInfo,
      usedBy: [...storedCodeInfo.usedBy, sessionId],
      // 关键：如果之前没有绑定ID，现在就给它绑上！
      // 如果之前就有，就保持不变。
      boundDeviceId: storedCodeInfo.boundDeviceId || (() => {
        newDeviceId = crypto.randomUUID();
        return newDeviceId;
      })(),
    };

    // 使用pipeline保证操作的原子性
    const pipeline = kv.pipeline();
    pipeline.set(sessionKey, { activatedWithCode: code }, { ex: 60 * 60 * 24 * 30 }); 
    pipeline.set(key, updatedCodeInfo); // 将包含boundDeviceId的新JSON写回数据库
    await pipeline.exec();

    // 创建成功的响应
    const response = NextResponse.json({ success: true });

    // 设置会话Cookie，这部分逻辑和您原来的一样
    response.cookies.set('auth_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 分钟
      domain: process.env.VERCEL_ENV === 'production' 
        ? '.song-one-sage.xyz' 
        : undefined
    });

    // 如果是首次激活（newDeviceId被成功创建），就给浏览器颁发“设备身份证”
    if (newDeviceId) {
      response.cookies.set(DEVICE_COOKIE_NAME, newDeviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: DEVICE_COOKIE_MAX_AGE, // 1 年
        domain: process.env.VERCEL_ENV === 'production' 
          ? '.song-one-sage.xyz' 
          : undefined
      });
    }

    return response;

  } catch (error) {
    console.error('激活 API 出错:', error);
    return NextResponse.json({ message: '服务器内部错误，请联系管理员' }, { status: 500 });
  }
}
