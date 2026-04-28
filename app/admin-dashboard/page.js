"use client";
import { useState } from 'react';

export default function PermissionsTest() {
  const [mode, setMode] = useState('read'); 
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!username.trim()) {
      setError('يرجى إدخال اسم المستخدم أولاً.');
      setResult('');
      return;
    }
    if (mode === 'write' && !value.trim()) {
      setError('يرجى إدخال القيمة المراد كتابتها.');
      setResult('');
      return;
    }

    setLoading(true);
    setResult('');
    setError('');

    try {
      const res = await fetch('/api/permissions-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, action: mode, value }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4">
      <div className="bg-gray-900/90 border border-blue-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-extrabold mb-6 text-center text-blue-400 drop-shadow-lg tracking-wide">
          اختبار الصلاحيات
        </h1>
        
        <p className="text-center text-gray-400 text-xs mb-6 pb-4 border-b border-gray-800">
          أدخل اسم المستخدم للتحقق من صلاحياته الفعلية في قاعدة البيانات.
        </p>

        <div className="space-y-4">
          <div className="flex gap-4">
            <button 
              onClick={() => { setMode('read'); setResult(''); setError(''); }} 
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                mode === 'read' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              قراءة (Read)
            </button>
            <button 
              onClick={() => { setMode('write'); setResult(''); setError(''); }} 
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                mode === 'write' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              كتابة (Write)
            </button>
          </div>

          <input 
            type="text" 
            placeholder="اسم المستخدم (Username)" 
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {mode === 'write' && (
            <input 
              type="text" 
              placeholder="القيمة المراد كتابتها (Value)" 
              className="w-full p-3 rounded-lg bg-gray-800 border border-green-700 focus:border-green-500 outline-none transition-all"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}

          <button 
            onClick={handleAction} 
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold shadow-lg transition-all text-white ${
              mode === 'read' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'جاري الفحص...' : (mode === 'read' ? 'تنفيذ القراءة' : 'تنفيذ الكتابة')}
          </button>
        </div>

        {result && <div className="mt-4 p-3 rounded-lg bg-green-900/30 border border-green-700 text-green-300 text-sm">{result}</div>}
        {error && <div className="mt-4 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">{error}</div>}
      </div>
    </div>
  );
}