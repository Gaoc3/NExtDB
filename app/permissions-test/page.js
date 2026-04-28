"use client";
import { useState } from 'react';

export default function PermissionsTest() {
  const [mode, setMode] = useState('read');
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setLoading(true); setRes(null);
    const response = await fetch('/api/permissions-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, action: mode, value }),
    });
    const data = await response.json();
    setRes(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4 font-mono">
      <div className="bg-gray-900 border border-blue-900/40 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-xl font-bold text-blue-500 mb-6 text-center italic">PERMISSION LAB</h1>
        <div className="space-y-4">
          <input type="text" placeholder="Username" className="w-full p-3 rounded bg-black border border-gray-800 outline-none focus:border-blue-500" value={username} onChange={(e) => setUsername(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={() => setMode('read')} className={`flex-1 py-2 rounded font-bold ${mode === 'read' ? 'bg-blue-600' : 'bg-gray-800 text-gray-500'}`}>READ</button>
            <button onClick={() => setMode('write')} className={`flex-1 py-2 rounded font-bold ${mode === 'write' ? 'bg-green-600' : 'bg-gray-800 text-gray-500'}`}>WRITE</button>
          </div>
          {mode === 'write' && <input type="text" placeholder="Value..." className="w-full p-3 rounded bg-black border border-green-900/40 outline-none" value={value} onChange={(e) => setValue(e.target.value)} />}
          <button onClick={handleExecute} disabled={loading} className="w-full bg-blue-500 py-3 rounded font-black active:scale-95 transition-all">
            {loading ? "EXECUTING..." : "EXECUTE REQUEST"}
          </button>
        </div>

        {res && (
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-800">
            <table className="w-full text-xs text-right border-collapse">
              <thead className={`bg-gray-800/50 ${res.error ? 'text-red-400' : 'text-green-400'}`}>
                <tr><th className="p-3 border-b border-gray-800" colSpan="2">{res.error ? "[DENIED]" : "[GRANTED]"}</th></tr>
              </thead>
              <tbody className="bg-black/40 divide-y divide-gray-800">
                <tr><td className="p-3 text-gray-500 bg-gray-900/30 w-1/3">DATA</td><td className="p-3 text-gray-200">{res.result || res.error}</td></tr>
                <tr><td className="p-3 text-gray-500 bg-gray-900/30">ROLE</td><td className="p-3 text-blue-400">{res.role}</td></tr>
                <tr><td className="p-3 text-gray-500 bg-gray-900/30">HASH</td><td className="p-3 text-yellow-600 truncate max-w-[150px]">{res.hash}</td></tr>
                {res.note && <tr><td className="p-3 text-gray-500 bg-gray-900/30">STATUS</td><td className="p-3 text-red-500">{res.note}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
