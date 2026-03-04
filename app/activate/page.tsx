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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  const res = await fetch('/api/activate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  setIsLoading(false);

  if (res.ok) {
    // 激活成功！
    
    // --- 【核心修改】 ---
    // 不要立即跳转，而是使用 setTimeout 创建一个微小的延迟。
    // 这几十毫秒对于用户是无感的，但对于浏览器处理 Cookie 至关重要。
    setTimeout(() => {
      router.push('/');
    }, 100); // 延迟 100 毫秒

  } else {
    const data = await res.json();
    setError(data.message || '激活失败，请检查你的激活码或网络连接。');
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
