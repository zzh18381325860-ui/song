import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// 这个函数专门用来验证 Session ID 是否真实有效
async function verifySessionInKV(sessionId: string): Promise<boolean> {
  try {
    // 【关键修正 1】: 我们检查的键是 'session:[ID]'，与 API 创建的键保持一致
    const sessionData = await kv.get(`session:${sessionId}`);
    // 只要能查到数据（不为 null），就说明 session 有效
    return sessionData !== null;
  } catch (error) {
    console.error('中间件在 KV 中验证 session 时出错:', error);
    // 如果查询过程出错，出于安全考虑，也视为无效
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(`Middleware is running for path: ${pathname}`);

  // --- 检查“通行证” ---
  const sessionCookie = req.cookies.get('auth_session');
  const sessionId = sessionCookie?.value;

  // 如果没有 Cookie，直接重定向
  if (!sessionId) {
    console.log('Middleware: 未找到 auth_session cookie，重定向到 /activate');
    const activateUrl = new URL('/activate', req.url);
    const response = NextResponse.redirect(activateUrl);

    // 【关键修正 2】: 强力禁止 Vercel Edge 缓存这个“重定向”行为
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  }

  // --- 核心安全验证 ---
  // 去数据库里核实这个 sessionId 是不是我们签发的
  const isSessionValid = await verifySessionInKV(sessionId);

  // 如果在 KV 数据库里查不到，说明 cookie 是伪造的或已失效
  if (!isSessionValid) {
    console.log(`Middleware: 检测到无效或伪造的 auth_session: ${sessionId}。正在重定向...`);
    const activateUrl = new URL('/activate', req.url);
    const response = NextResponse.redirect(activateUrl);
    
    // 主动删除这个无效的 cookie
    response.cookies.delete('auth_session');

    // 【关键修正 2】: 同样，这个重定向也不能被缓存！
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }

  // --- 放行 ---
  // 如果代码执行到这里，说明用户持有真实有效的“通行证”
  console.log('Middleware: Session 有效，放行。');
  return NextResponse.next();
}

// --- 配置管辖范围 ---
// 这个 matcher 经过优化，直接排除了 activate 页面，效率更高
// 因为访问 /activate 页面根本不需要检查 cookie，让中间件跳过它能节省一次 KV 查询
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|activate).*)',
  ],
};
