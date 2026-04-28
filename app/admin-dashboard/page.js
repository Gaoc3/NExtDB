"use client";
import { useState } from 'react';

export default function PermissionsTest() {
  const [mode, setMode] = useState('read'); 
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleAction = async () => {
    setResult('');
    setError('');

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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-blue-900 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-400 mb-6 text-center">Permissions Test System</h1>
        
        <div className="space-y-4">
          {/* إدخال اسم المستخدم يدوياً */}
          <input 
            type="text" 
            placeholder="أدخل اسم المستخدم (مثلاً: adminUser)" 
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* اختيار نمط الاختبار */}
          <div className="flex gap-2">
            <button 
              onClick={() => setMode('read')}
              className={`flex-1 py-2 rounded-lg font-bold transition ${mode === 'read' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              اختبار قراءة
            </button>
            <button 
              onClick={() => setMode('write')}
              className={`flex-1 py-2 rounded-lg font-bold transition ${mode === 'write' ? 'bg-green-600' : 'bg-gray-700'}`}
            >
              اختبار كتابة
            </button>
          </div>

          {/* حقل الكتابة يظهر فقط عند اختيار الكتابة */}
          {mode === 'write' && (
            <input 
              type="text" 
              placeholder="اكتب المحتوى الذي تريد حفظه..." 
              className="w-full p-3 rounded-lg bg-gray-900 border border-green-700 text-white"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}

          <button 
            onClick={handleAction}
            className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-extrabold shadow-lg"
          >
            {mode === 'read' ? 'قراءة البيانات من DB' : 'إرسال بيانات للـ DB'}
          </button>
        </div>

        {/* عرض النتائج */}
        {result && <div className="mt-6 p-4 rounded bg-green-900/20 border border-green-500 text-green-400 text-sm italic">{result}</div>}
        {error && <div className="mt-6 p-4 rounded bg-red-900/20 border border-red-500 text-red-400 text-sm">{error}</div>}
      </div>
    </div>
  );
}