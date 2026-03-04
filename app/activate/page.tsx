'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivatePage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!code.trim()) {
      setError('激活码不能为空');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        // 激活成功！
        // 可以直接刷新页面，让中间件重新验证并跳转到主页
        // 或者使用 router.push('/') 跳转，效果相同
        alert('激活成功！即将跳转到主页。');
        window.location.href = '/'; // 采用最直接的页面重载方式
      } else {
        // 激活失败，显示服务器返回的错误信息
        const data = await response.json();
        setError(data.message || '发生未知错误');
      }
    } catch (err) {
      console.error('激活请求失败:', err);
      setError('无法连接到服务器，请检查您的网络连接。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <div style={{ width: '320px', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>服务激活</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="请输入您的激活码"
            disabled={isLoading}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              color: 'white',
              backgroundColor: isLoading ? '#999' : '#0070f3',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isLoading ? '正在激活...' : '立即激活'}
          </button>
        </form>
        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
