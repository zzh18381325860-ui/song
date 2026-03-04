// --- 用于调试的极简 middleware.ts ---
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log(`Middleware is running for path: ${pathname}`);

  // 只要不是 /activate 页面，就无条件重定向！
  // 这是一个非常强的规则，用来测试中间件是否真的在运行。
  if (pathname !== '/activate') {
    const activateUrl = new URL('/activate', req.url);
    
    // 我们甚至可以在日志里看到重定向的决定
    console.log(`Redirecting to: ${activateUrl.toString()}`);
    
    return NextResponse.redirect(activateUrl);
  }

  // 如果已经是 /activate，就放行
  return NextResponse.next();
}

export const config = {
  // matcher 保持不变，它是正确的
  matcher: '/((?!_next/static|_next/image|favicon.ico|api/).*)',
};
