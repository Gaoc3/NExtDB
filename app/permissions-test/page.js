"use client";
import { useState } from 'react';

export default function PermissionsTest() {
  const [mode, setMode] = useState('read'); 
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [errorData, setErrorData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    setResult(null);
    setErrorData(null);

    try {
      const res = await fetch('/api/permissions-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, action: mode, value }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setErrorData(data); // نخزن كل البيانات حتى في حالة الخطأ لعرض الهاش
      }
    } catch (err) {
      alert("فشل الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  // عرض البيانات التقنية (تاريخ، هاش، رول)
  const renderTechInfo = (info) => (
    <div className="mt-6 p-4 rounded bg-black/40 border border-gray-800 text-[10px] font-mono space-y-2">
      <div className="flex justify-between border-b border-gray-800 pb-1">
        <span className="text-gray-500 uppercase">Role:</span>
        <span className="text-blue-400">{info.role}</span>
      </div>
      <div className="flex justify-between border-b border-gray-800 pb-1">
        <span className="text-gray-500 uppercase">Created:</span>
        <span className="text-gray-400">{info.Created_At ? new Date(info.Created_At).toLocaleDateString() : 'N/A'}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-gray-500 uppercase">Password Hash:</span>
        <span className="text-yellow-600 truncate bg-gray-900 p-1 rounded" title={info.Encrypted_Password}>
          {info.Encrypted_Password}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-blue-900/50 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-xl font-bold text-blue-500 mb-6 text-center italic tracking-tighter">PERMISSIONS ANALYZER</h1>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Enter Username" 
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
            value={username} onChange={(e) => setUsername(e.target.value)}
          />

          <div className="flex gap-2">
            <button onClick={() => setMode('read')} className={`flex-1 py-2 rounded font-bold transition ${mode === 'read' ? 'bg-blue-600 shadow-lg' : 'bg-gray-800 text-gray-500'}`}>READ</button>
            <button onClick={() => setMode('write')} className={`flex-1 py-2 rounded font-bold transition ${mode === 'write' ? 'bg-green-600 shadow-lg' : 'bg-gray-800 text-gray-500'}`}>WRITE</button>
          </div>

          {mode === 'write' && (
            <input 
              type="text" placeholder="Data to inject..." 
              className="w-full p-3 rounded bg-gray-800 border border-green-900/50 outline-none"
              value={value} onChange={(e) => setValue(e.target.value)}
            />
          )}

          <button onClick={handleAction} disabled={loading} className="w-full bg-blue-500 py-3 rounded font-black hover:bg-blue-400 active:scale-95 transition-all">
            {loading ? "ANALYZING..." : "EXECUTE REQUEST"}
          </button>
        </div>

        {/* عرض نتيجة النجاح */}
        {result && (
          <div className="mt-4 p-3 rounded bg-green-900/10 border border-green-500 text-xs text-green-400 font-mono">
            {result.result}
            {renderTechInfo(result)}
          </div>
        )}

        {/* عرض نتيجة الرفض */}
        {errorData && (
          <div className="mt-4 p-3 rounded bg-red-900/10 border border-red-500 text-xs text-red-400 font-mono">
            {errorData.error}
            {renderTechInfo(errorData)}
          </div>
        )}
      </div>
    </div>
  );
}
