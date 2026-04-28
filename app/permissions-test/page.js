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
      if (res.ok) setResult(data);
      else setErrorData(data);
    } catch (err) {
      alert("فشل الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-blue-900/40 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-xl font-bold text-blue-500 mb-6 text-center italic tracking-tighter">PERMISSION LAB 🔒</h1>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Username" 
            className="w-full p-3 rounded bg-black border border-gray-800 outline-none focus:border-blue-500 transition-all"
            value={username} onChange={(e) => setUsername(e.target.value)}
          />

          <div className="flex gap-2">
            <button onClick={() => setMode('read')} className={`flex-1 py-2 rounded font-bold transition-all ${mode === 'read' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-gray-800 text-gray-500'}`}>READ</button>
            <button onClick={() => setMode('write')} className={`flex-1 py-2 rounded font-bold transition-all ${mode === 'write' ? 'bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.4)]' : 'bg-gray-800 text-gray-500'}`}>WRITE</button>
          </div>

          {mode === 'write' && (
            <input 
              type="text" placeholder="Temporary Data (10s)..." 
              className="w-full p-3 rounded bg-black border border-green-900/40 outline-none"
              value={value} onChange={(e) => setValue(e.target.value)}
            />
          )}

          <button onClick={handleAction} disabled={loading} className="w-full bg-blue-500 py-3 rounded font-black hover:bg-blue-400 active:scale-95 transition-all shadow-lg">
            {loading ? "EXECUTING..." : "EXECUTE REQUEST"}
          </button>
        </div>

        {/* عرض النتائج */}
        {(result || errorData) && (
          <div className={`mt-6 p-4 rounded border text-xs font-mono space-y-3 ${result ? 'bg-blue-900/10 border-blue-500/50' : 'bg-red-900/10 border-red-500/50'}`}>
            <div className="flex justify-between font-bold border-b border-gray-800 pb-2">
              <span className={result ? "text-green-400" : "text-red-400"}>{result ? "[ACCESS GRANTED]" : "[ACCESS DENIED]"}</span>
              <span className="text-gray-400">{result?.role || errorData?.role}</span>
            </div>
            
            <p className="text-gray-200">{result?.result || errorData?.error}</p>

            {/* عرض الهاش المشفر إذا كان مسموحاً */}
            {(result || errorData) && (
              <div className="pt-2 border-t border-gray-800">
                <span className="text-gray-500 block mb-1">Encrypted Hash:</span>
                <code className="text-yellow-600 bg-black/60 p-1 rounded block truncate" title={result?.Encrypted_Password || errorData?.Encrypted_Password}>
                  {result?.Encrypted_Password || errorData?.Encrypted_Password}
                </code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
