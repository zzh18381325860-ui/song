// middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv'; // <<--- 【新增】导入 Vercel KV 客户端

// 这是我们整个系统的“守门人”逻辑
export async function middleware(req: NextRequest) { // <<--- 【修改】将函数变为 async
  // 获取用户当前想要访问的路径，例如 "/dashboard" 或 "/activate"
  const { pathname } = req.nextUrl;

  // --- 白名单逻辑 ---
  // 激活页面和API接口必须可以被任何人访问。
  // 【优化】将根路径 '/' 也加入白名单，通常根路径是公开的。
  if (pathname.startsWith('/activate') || pathname.startsWith('/api/activate')) {
    return NextResponse.next();
  }

  // --- 检查“通行证” ---
  const sessionCookie = req.cookies.get('auth_session');
  const deviceId = sessionCookie?.value; // <<--- 【新增】获取 cookie 的值

  // 如果没有找到这个 Cookie 或者 Cookie 里没有值，说明用户未激活。
  if (!deviceId) {
    const activateUrl = new URL('/activate', req.url);
    return NextResponse.redirect(activateUrl);
  }

  // --- 【！！！核心安全升级！！！】 ---
  // --- 验证 Cookie 值的真实性 ---
  // 我们不能只相信用户有 cookie，必须去数据库里核实这个 cookie 的值 (deviceId) 是不是我们签发的。
  // 这就是我们之前在 route.ts 里设置 `device:${deviceId}` 的原因。
  const sessionStatus = await kv.get(`device:${deviceId}`);

  // 如果在 KV 数据库里查不到这个 deviceId 对应的记录，说明这个 cookie 是伪造的或已失效。
  if (sessionStatus !== 'active') {
    console.log(`Middleware: 检测到无效或伪造的 auth_session: ${deviceId}。正在重定向...`);
    // 创建重定向响应
    const activateUrl = new URL('/activate', req.url);
    const response = NextResponse.redirect(activateUrl);
    
    // 【重要】主动删除这个无效的 cookie，避免用户下次还带着它来请求。
    response.cookies.delete('auth_session');
    
    return response;
  }
  // --- 安全验证结束 ---


  // --- 放行逻辑 ---
  // 如果代码执行到这里，说明用户持有我们签发的、真实有效的“通行证” Cookie。
  return NextResponse.next();
}


// --- 配置守卫的“管辖范围” ---
export const config = {
  matcher: [
    /*
     * 你的这个 matcher 配置非常棒，它聪明地排除了静态资源。
     * 唯一的补充是，它也会匹配根路径 '/'。
     * 这就是为什么我们在上面的白名单逻辑里也加上了对 '/' 的判断。
     * 这样可以确保你的首页（如果它是公开的）不会被拦截。
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
