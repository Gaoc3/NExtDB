"use client";
import { useState } from 'react';

export default function PermissionsTest() {
  const [mode, setMode] = useState('read'); 
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    setResponse(null);
    setError(null);

    const res = await fetch('/api/permissions-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, action: mode, value }),
    });
    
    const data = await res.json();
    if (res.ok) {
      setResponse(data);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4 font-mono">
      <div className="bg-gray-900 border border-blue-900 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-xl font-bold text-blue-500 mb-6 text-center tracking-tighter italic">SECURITY PERMISSIONS TEST</h1>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Username" 
            className="w-full p-3 rounded bg-black border border-gray-800 outline-none focus:border-blue-500"
            value={username} onChange={(e) => setUsername(e.target.value)}
          />

          <div className="flex gap-2">
            <button onClick={() => setMode('read')} className={`flex-1 py-2 rounded font-bold ${mode === 'read' ? 'bg-blue-600' : 'bg-gray-800 text-gray-500'}`}>READ</button>
            <button onClick={() => setMode('write')} className={`flex-1 py-2 rounded font-bold ${mode === 'write' ? 'bg-green-600' : 'bg-gray-800 text-gray-500'}`}>WRITE</button>
          </div>

          {mode === 'write' && (
            <input 
              type="text" placeholder="Data to store..." 
              className="w-full p-3 rounded bg-black border border-green-900/50 outline-none"
              value={value} onChange={(e) => setValue(e.target.value)}
            />
          )}

          <button onClick={handleExecute} className="w-full bg-blue-500 py-3 rounded font-black hover:bg-blue-400 transition-all">EXECUTE</button>
        </div>

        {/* عرض النتيجة والهاش */}
        {response && (
          <div className="mt-6 p-4 rounded bg-blue-900/10 border border-blue-500 text-xs space-y-2">
            <p className="text-green-400 font-bold underline">ACCESS GRANTED</p>
            <p>{response.result}</p>
            {response.hash && (
              <div className="pt-2 border-t border-blue-900/50">
                <p className="text-gray-500 mb-1 italic">Your Encrypted Hash:</p>
                <code className="text-yellow-600 bg-black p-1 rounded block break-all">{response.hash}</code>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded bg-red-900/10 border border-red-500 text-xs text-red-500">
            <p className="font-bold underline">ACCESS DENIED</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
