'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState({ msg: '', type: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ msg: 'جاري تطبيق خوارزميات التشفير والحماية...', type: 'info' });

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus({ msg: `${data.message} ${data.mfa_hint || ''}`, type: 'success' });
      setTimeout(() => {
        router.push('/permissions-test');
      }, 1200);
    } else {
      setStatus({ msg: data.error, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4">
      <div className="bg-gray-900/90 border border-blue-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-400 drop-shadow-lg tracking-wide">تسجيل الدخول</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">اسم المستخدم</label>
            <input type="text" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none" 
              onChange={(e) => setFormData({ ...formData, username: e.target.value })} required autoComplete="username" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
            <input type="email" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none" 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} required autoComplete="email" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">كلمة المرور</label>
            <input type="password" placeholder="8 رموز على الأقل" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none" 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} required autoComplete="current-password" />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold shadow-lg transition-all">
              Sign Up
            </button>
            <button type="button" className="flex-1 bg-gray-700 hover:bg-gray-800 py-3 rounded-lg font-bold shadow-lg transition-all" onClick={() => window.location.href = '/login'}>
              Login
            </button>
          </div>
        </form>
        {status.msg && (
          <div className={`mt-6 p-4 rounded-lg text-sm border ${status.type === 'success' ? 'bg-green-900/30 border-green-500 text-green-400' : status.type === 'error' ? 'bg-red-900/30 border-red-500 text-red-400' : 'bg-blue-900/30 border-blue-500 text-blue-400'}`}>
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
}