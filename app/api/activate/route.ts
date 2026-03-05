import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
// import { cookies } from 'next/headers'; // 【修复】移除这一行，我们不再需要它

export const runtime = 'edge';

const DEVICE_COOKIE_NAME = 'device_fingerprint';
const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface ActivationCodeInfo {
  totalUses: number;
  usedBy: string[];
  boundDeviceId: string | null;
}

export async function POST(request: NextRequest) { // request 对象在这里
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ message: '激活码格式不正确' }, { status: 400 });
    }

    const key = code;
    
    // 【【【 核心修复 】】】
    // 不再使用 cookies() 函数，而是直接从 request 对象上获取 cookie
    const deviceIdFromCookie = request.cookies.get(DEVICE_COOKIE_NAME)?.value;

    const storedCodeInfo: ActivationCodeInfo | null = await kv.get(key);

    if (storedCodeInfo === null) {
      return NextResponse.json({ message: '激活码无效' }, { status: 404 });
    }
    
    if (storedCodeInfo.boundDeviceId) {
      if (storedCodeInfo.boundDeviceId !== deviceIdFromCookie) {
        return NextResponse.json({ message: '此激活码已被另一台设备绑定' }, { status: 403 });
      }
    }
    
    if (storedCodeInfo.usedBy.length >= storedCodeInfo.totalUses) {
      return NextResponse.json({ message: '此激活码的使用次数已耗尽' }, { status: 403 });
    }

    // --- 所有验证通过，开始执行激活操作 ---

    const sessionId = crypto.randomUUID();
    const sessionKey = `session:${sessionId}`;
    let newDeviceId: string | null = null;

    const updatedCodeInfo: ActivationCodeInfo = {
      ...storedCodeInfo,
      usedBy: [...storedCodeInfo.usedBy, sessionId],
      boundDeviceId: storedCodeInfo.boundDeviceId || (() => {
        newDeviceId = crypto.randomUUID();
        return newDeviceId;
      })(),
    };

    const pipeline = kv.pipeline();
    pipeline.set(sessionKey, { activatedWithCode: code }, { ex: 60 * 60 * 24 * 30 }); 
    pipeline.set(key, updatedCodeInfo);
    await pipeline.exec();

    const response = NextResponse.json({ success: true });

    response.cookies.set('auth_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 5,
      domain: process.env.VERCEL_ENV === 'production' 
        ? '.song-one-sage.xyz' 
        : undefined
    });

    if (newDeviceId) {
      response.cookies.set(DEVICE_COOKIE_NAME, newDeviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: DEVICE_COOKIE_MAX_AGE,
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
