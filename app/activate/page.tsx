// 文件路径: app/activate/page.tsx

'use client'; // 这一行非常重要！它告诉 Next.js 这是一个与用户交互的“客户端组件”

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivatePage() {
  // 这三个变量用来管理页面的状态
  const [code, setCode] = useState(''); // 存储用户输入的激活码
  const [error, setError] = useState(''); // 存储激活失败时的错误信息
  const [isLoading, setIsLoading] = useState(false); // 控制按钮是否在加载中
  const router = useRouter();

  // 当用户点击“激活”按钮时，这个函数会被调用
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 防止页面刷新
    setError(''); // 清空上一次的错误信息
    setIsLoading(true); // 显示加载状态

    // 使用 fetch 函数向我们“即将创建”的后端API发送请求
    const res = await fetch('/api/activate', {
      method: 'POST', // 使用 POST 方法
      headers: { 'Content-Type': 'application/json' }, // 告诉服务器我们发送的是 JSON 数据
      body: JSON.stringify({ code }), // 将用户输入的激活码打包成 JSON
    });

    setIsLoading(false); // 结束加载状态

    if (res.ok) {
      // 如果服务器返回成功 (状态码 200)
      alert('激活成功！即将跳转到主页。');
      router.push('/'); // 跳转到网站主页
      //router.refresh(); 
// 刷新页面以确保中间件重新验证
    } else {
      // 如果服务器返回失败
      const { message } = await res.json(); // 读取服务器返回的错误信息
      setError(message || '激活失败，请检查你的激活码或网络连接。');
    }
  };

  // 这是页面的 HTML 结构 (使用 JSX 语法)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', background: '#f0f2f5' }}>
      <div style={{ padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px', color: '#333333' }}>激活您的访问权限</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="请输入您的激活码"
            disabled={isLoading}
            style={{ padding: '12px', fontSize: '16px', width: '300px', border: '1px solid #ccc', borderRadius: '4px', color: '#333333' }}
          />
          <button type="submit" disabled={isLoading} style={{ padding: '12px', fontSize: '16px', color: 'white', background: '#0070f3', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {isLoading ? '正在激活...' : '立即激活'}
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '16px', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
}
