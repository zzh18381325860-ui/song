// 文件路径: app/api/activate/route.ts


import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// 为了代码更清晰，我们先定义一下存储在数据库里的数据长什么样
interface LicenseData {
  totalUses: number; // 总共允许激活的次数
  usedBy: string[];    // 一个数组，用来存放已经激活过的设备ID
}

// 我们只接受 POST 方法的请求，因为激活是一个会改变数据的操作
export async function POST(req: NextRequest) {
  try {
    // 1. 从前端发来的请求中解析出 JSON 数据，主要是 'code' 字段
    const { code } = await req.json();

    // 基础验证：确保前端真的传了激活码过来
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ message: '激活码不能为空。' }, { status: 400 }); // Bad Request
    }

    // 2. 使用激活码作为 key，去 Vercel KV 数据库查询对应的数据
    const license = await kv.get<LicenseData>(code);
    // --- 重要的调试步骤 ---
    // 把从 KV 获取的原始数据打印到你的开发服务器终端
    console.log('从KV获取的原始license数据:', license); 
    if (license) {
        console.log('totalUses 的值:', license.totalUses, '类型是:', typeof license.totalUses);
        console.log('usedBy 的值:', license.usedBy, 'usedBy是否是数组:', Array.isArray(license.usedBy));
    }
    // --- 调试结束 ---

    // 3. 验证激活码是否存在
    if (!license) {
      // 如果数据库里查不到这个码，说明是无效的
      return NextResponse.json({ message: '无效的激活码。' }, { status: 404 }); // Not Found
    }

    // 4. 验证激活次数是否已用完
    // license.usedBy.length 是已经激活的设备数量
    // license.totalUses 是我们设定的总次数 (比如 3)
    if (license.usedBy.length >= license.totalUses) {
      return NextResponse.json({ message: '此激活码的使用次数已达上限。' }, { status: 403 }); // Forbidden
    }

    // --- 所有验证通过，开始执行激活操作 ---

    // 5. 为这台设备生成一个独一无二的ID
    // crypto.randomUUID() 是一个标准的、安全的生成唯一ID的方法
    const deviceId = crypto.randomUUID();

    // 6. 准备要存回数据库的新数据
    // 我们在原有的 usedBy 数组里，加上这次新生成的 deviceId
    const newLicenseData: LicenseData = {
      ...license,
      usedBy: [...license.usedBy, deviceId]
    };
    
    // 7. 将更新后的数据写回 Vercel KV 数据库
    // kv.set 是原子操作，能保证数据写入的完整性
      await kv.set(code, newLicenseData);
      await kv.set(`device:${deviceId}`, 'active', { ex: 60 * 60 * 24 * 365 }); // 设置一个和cookie差不多的过期时间


    // 8. 颁发“通行证”！
    // 我们将刚才生成的 deviceId 作为一个安全的 Cookie 存入用户的浏览器
  // 这是 Edge 运行时兼容的写法
// 1. 先准备好要返回的 JSON 响应
const response = NextResponse.json({ message: '激活成功！' }, { status: 200 });

// 2. 在这个响应对象上设置 Cookie
response.cookies.set('auth_session', deviceId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 365,
});

// 3. 返回这个携带了 Cookie 的响应对象
return response;

  } catch (error) {
    // 如果过程中出现任何预料之外的错误，捕获它并返回一个服务器错误信息
    console.error('激活 API 出错:', error);
    return NextResponse.json({ message: '服务器内部错误，请稍后再试。' }, { status: 500 });
  }
}
