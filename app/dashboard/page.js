'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/register/users')
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setUsers(data);
      })
      .catch(() => setError('فشل الاتصال بالخادم'));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10 text-gray-100">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-400 drop-shadow-lg tracking-wide">سجل المستخدمين الآمن (Dashboard)</h1>
      {error && <p className="text-red-400 text-center mb-4 bg-red-900/40 p-3 rounded-lg border border-red-700 shadow">{error}</p>}
      <div className="max-w-4xl mx-auto bg-gray-900/80 shadow-2xl rounded-2xl overflow-hidden border border-blue-900/40 backdrop-blur-md">
        <table className="w-full text-right">
          <thead className="bg-gradient-to-l from-blue-900 via-blue-700 to-blue-800 text-blue-100">
            <tr>
              <th className="p-4 font-bold tracking-wider">ID</th>
              <th className="p-4 font-bold tracking-wider">اسم المستخدم</th>
              <th className="p-4 font-bold tracking-wider">الايميل</th>
              <th className="p-4 font-bold tracking-wider">الباسورد المشفر</th>
              <th className="p-4 font-bold tracking-wider">تاريخ الانضمام</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.ID} className="border-b border-gray-800 hover:bg-blue-900/30 transition-all">
                <td className="p-4 text-blue-300 font-semibold">{u.ID}</td>
                <td className="p-4 font-bold text-blue-100">{u.Username}</td>
                <td className="p-4 text-blue-200">{u.Email}</td>
                <td className="p-4 text-gray-500 text-xs break-all max-w-xs">{u.Encrypted_Password}</td>
                <td className="p-4 text-xs text-gray-400">{new Date(u.Created_At).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ...existing code... */}
    </div>
  );
}