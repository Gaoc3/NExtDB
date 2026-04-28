"use client";
import { useState } from 'react';

export default function PermissionsTest() {
  const [mode, setMode] = useState('read'); 
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setLoading(true); setResponse(null); setError(null);
    try {
      const res = await fetch('/api/permissions-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, action: mode, value }),
      });
      const data = await res.json();
      if (res.ok) setResponse(data);
      else setError(data);
    } catch (err) { alert("Server Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4 font-mono">
      <div className="bg-gray-900 border border-blue-900/50 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-xl font-bold text-blue-500 mb-6 text-center italic tracking-tighter">PERMISSIONS LAB v2.0</h1>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Username" 
            className="w-full p-3 rounded bg-black border border-gray-800 outline-none focus:border-blue-500 transition-all"
            value={username} onChange={(e) => setUsername(e.target.value)}
          />

          <div className="flex gap-2">
            <button onClick={() => setMode('read')} className={`flex-1 py-2 rounded font-bold ${mode === 'read' ? 'bg-blue-600 shadow-lg' : 'bg-gray-800 text-gray-500'}`}>READ</button>
            <button onClick={() => setMode('write')} className={`flex-1 py-2 rounded font-bold ${mode === 'write' ? 'bg-green-600 shadow-lg' : 'bg-gray-800 text-gray-500'}`}>WRITE</button>
          </div>

          {mode === 'write' && (
            <input 
              type="text" placeholder="Value to inject..." 
              className="w-full p-3 rounded bg-black border border-green-900/50 outline-none"
              value={value} onChange={(e) => setValue(e.target.value)}
            />
          )}

          <button onClick={handleExecute} disabled={loading} className="w-full bg-blue-500 py-3 rounded font-black hover:bg-blue-400 active:scale-95 transition-all">
            {loading ? "COMMUNICATING WITH DB..." : "EXECUTE REQUEST"}
          </button>
        </div>

        {/* عرض النتيجة والهاش */}
        {(response || error) && (
          <div className={`mt-6 p-4 rounded border text-xs space-y-2 ${response ? 'bg-green-900/10 border-green-500' : 'bg-red-900/10 border-red-500'}`}>
            <p className="font-bold underline uppercase">{response ? "Access Granted" : "Access Denied"}</p>
            <p className="text-gray-200">{response?.result || error?.error}</p>
            <div className="pt-2 border-t border-gray-800 mt-2">
              <span className="text-gray-500 block mb-1 uppercase text-[10px]">Security Hash:</span>
              <code className="text-yellow-600 bg-black p-1 rounded block break-all">{response?.hash || error?.hash}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
