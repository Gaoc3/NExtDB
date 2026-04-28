"use client";
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب المستخدمين عند تحميل الصفحة
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin-dashboard');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const updateRole = async (username, newRole) => {
    const res = await fetch('/api/admin-dashboard', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, newRole }),
    });
    if (res.ok) {
      alert(`تم تحديث صلاحية ${username} إلى ${newRole}`);
      fetchUsers(); // تحديث القائمة
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-blue-400">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-blue-400 border-b border-gray-800 pb-4">
          لوحة تحكم المسؤول (Management)
        </h1>
        
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-4">المستخدم</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4">الصلاحية الحالية</th>
                <th className="p-4 text-center">تعديل الصلاحية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.Username} className="hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 font-medium">{user.Username}</td>
                  <td className="p-4 text-gray-400">{user.Email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.Role === 'admin' ? 'bg-red-900/40 text-red-400 border border-red-800' : 
                      user.Role === 'writer' ? 'bg-green-900/40 text-green-400 border border-green-800' : 
                      'bg-blue-900/40 text-blue-400 border border-blue-800'
                    }`}>
                      {user.Role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <select 
                      className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={user.Role}
                      onChange={(e) => updateRole(user.Username, e.target.value)}
                    >
                      <option value="reader">Reader</option>
                      <option value="writer">Writer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}