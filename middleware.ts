import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 从 cookie 中获取会话 ID
  const sessionId = request.cookies.get('auth_session')?.value;

  // 如果没有会话 ID，直接重定向到激活页面
  if (!sessionId) {
    console.log('中间件：未找到 auth_session cookie，重定向到 /activate');
    return NextResponse.redirect(new URL('/activate', request.url));
  }

  // 如果有会话 ID，去数据库验证其有效性
  // 【关键变化】会话的 key 是有 'session:' 前缀的
  const sessionKey = `session:${sessionId}`;
  const session = await kv.get(sessionKey);

  // 如果数据库中不存在该会话（可能已过期或伪造），则重定向到激活页面
  if (!session) {
    console.log(`中间件：cookie 中的 session ID (${sessionId}) 无效或已过期，重定向到 /activate`);
    const response = NextResponse.redirect(new URL('/activate', request.url));
    // 清除掉浏览器里无效的 cookie
    response.cookies.delete('auth_session');
    return response;
  }

  // 会话有效，允许用户访问
  console.log(`中间件：session ID (${sessionId}) 验证通过，允许访问 ${pathname}`);
  return NextResponse.next();
}

// 配置中间件要保护的路径
export const config = {
  // 使用这个复杂的正则表达式来匹配除了特定资源外的所有路径
  // 它会保护根目录 '/' 和所有子页面
  // 但会忽略 /api, /activate, _next/static, _next/image, 和 favicon.ico
  matcher: ['/((?!api|activate|_next/static|_next/image|favicon.ico).*)'],
};
