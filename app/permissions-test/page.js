"use client";
import { useState } from 'react';

export default function PermissionsTest() {
  const [mode, setMode] = useState('read'); 
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

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
        setError(data.error);
      }
    } catch (err) {
      setError("فشل الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-blue-900 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-xl font-bold text-blue-400 mb-6 text-center italic">PERMISSION TEST CORE</h1>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Username" 
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 outline-none"
            value={username} onChange={(e) => setUsername(e.target.value)}
          />

          <div className="flex gap-2">
            <button onClick={() => setMode('read')} className={`flex-1 py-2 rounded font-bold ${mode === 'read' ? 'bg-blue-600' : 'bg-gray-800'}`}>Read</button>
            <button onClick={() => setMode('write')} className={`flex-1 py-2 rounded font-bold ${mode === 'write' ? 'bg-green-600' : 'bg-gray-800'}`}>Write</button>
          </div>

          {mode === 'write' && (
            <input 
              type="text" placeholder="Data to write..." 
              className="w-full p-3 rounded bg-gray-800 border border-green-900 outline-none"
              value={value} onChange={(e) => setValue(e.target.value)}
            />
          )}

          <button onClick={handleAction} disabled={loading} className="w-full bg-blue-500 py-3 rounded font-black hover:bg-blue-400 transition-all">
            {loading ? "PROCESSING..." : "EXECUTE REQUEST"}
          </button>
        </div>

        {/* عرض النتائج التقنية */}
        {result && (
          <div className="mt-6 p-4 rounded bg-blue-900/10 border border-blue-500 text-xs font-mono space-y-2">
            <p className="text-green-400 font-bold">SUCCESS:</p>
            <p>MESSAGE: {result.result}</p>
            <p>ROLE: {result.role}</p>
            <p className="truncate">HASH: {result.Encrypted_Password}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded bg-red-900/10 border border-red-500 text-xs font-mono">
            <p className="text-red-500 font-bold">DENIED:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
