
export default function PermissionsTest() {
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [manualRole, setManualRole] = useState('');

  const handleAction = async (action) => {
    setResult('');
    setError('');
    const res = await fetch('/api/permissions-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, action, value }),
    });
    const data = await res.json();
    if (res.ok) {
      setResult(data.result);
      setRole(data.role);
    } else {
      setError(data.error);
      setRole(data.role || '');
    }
  };

  // أمثلة للأدوار
  const examples = [
    { username: 'adminUser', role: 'admin', desc: 'قراءة وكتابة' },
    { username: 'writerUser', role: 'writer', desc: 'كتابة وقراءة فقط' },
    { username: 'readerUser', role: 'reader', desc: 'قراءة فقط' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4">
      <div className="bg-gray-900/90 border border-blue-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-extrabold mb-6 text-center text-blue-400 drop-shadow-lg tracking-wide">Permissions Test</h1>
        <div className="mb-4 text-xs text-gray-400">
          <div className="mb-2">أمثلة للأدوار (جربها أو عدلها يدوياً):</div>
          <ul className="mb-2">
            {examples.map(e => (
              <li key={e.username} className="mb-1">
                <button className="underline text-blue-300 mr-2" onClick={() => { setUsername(e.username); setManualRole(e.role); }}>تجربة {e.role}</button>
                <span className="text-gray-300">{e.username} ({e.desc})</span>
              </li>
            ))}
          </ul>
          <div>يمكنك تعديل الدور يدوياً هنا (admin, writer, reader):
            <input type="text" className="ml-2 p-1 rounded bg-gray-800 border border-gray-700 w-24 text-xs" value={manualRole} onChange={e => setManualRole(e.target.value)} placeholder="role" />
          </div>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Username" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="text" placeholder="Value to write (for write test)" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none" value={value} onChange={e => setValue(e.target.value)} />
          <div className="flex gap-4">
            <button onClick={() => handleAction('read')} className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold shadow-lg transition-all">Read</button>
            <button onClick={() => handleAction('write')} className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold shadow-lg transition-all">Write</button>
          </div>
        </div>
        {manualRole && <div className="mt-4 text-xs text-blue-300">Manual Role: {manualRole}</div>}
        {role && <div className="mt-2 text-xs text-blue-300">DB Role: {role}</div>}
        {result && <div className="mt-4 p-3 rounded-lg bg-blue-900/30 border border-blue-700 text-blue-200">Result: {result}</div>}
        {error && <div className="mt-4 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-200">{error}</div>}
      </div>
    </div>
  );
}
