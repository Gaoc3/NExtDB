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
    try {
      const res = await fetch('/api/admin-dashboard');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (username, newRole) => {
    const res = await fetch('/api/admin-dashboard', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, newRole }),
    });
    if (res.ok) {
      alert(`تم تحديث صلاحية ${username} إلى ${newRole}`);
      fetchUsers(); // تحديث القائمة فوراً
    } else {
      alert('حدث خطأ أثناء التحديث!');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-500 font-mono animate-pulse">جاري تحميل بيانات النظام السري...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-8 text-red-500 border-b border-red-900/50 pb-4 tracking-widest">
          ROOT CONTROL PANEL 🔒
        </h1>
        
        <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
          <table className="w-full text-left" dir="rtl">
            <thead className="bg-gray-800/80 text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-4">المستخدم</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4">الباسورد (Hash)</th>
                <th className="p-4">تاريخ الانضمام</th>
                <th className="p-4">الصلاحية الحالية</th>
                <th className="p-4 text-center">تعديل الصلاحية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 font-mono text-sm">
              {users.map((user) => (
                <tr key={user.Username} className="hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-bold text-blue-400">{user.Username}</td>
                  <td className="p-4 text-gray-400 text-xs">{user.Email}</td>
                  
                  {/* عمود الباسورد المشفر */}
                  <td className="p-4">
                    <code className="text-xs text-yellow-600 bg-black/50 px-2 py-1 rounded block max-w-[140px] truncate" title={user.Encrypted_Password}>
                      {user.Encrypted_Password || 'غير متوفر'}
                    </code>
                  </td>
                  
                  {/* عمود تاريخ الانضمام */}
                  <td className="p-4 text-gray-500 text-xs">
                    {user.Created_At ? new Date(user.Created_At).toLocaleString('ar-EG') : 'N/A'}
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      user.Role === 'admin' ? 'bg-red-900/40 text-red-400 border border-red-800' : 
                      user.Role === 'writer' ? 'bg-green-900/40 text-green-400 border border-green-800' : 
                      'bg-blue-900/40 text-blue-400 border border-blue-800'
                    }`}>
                      {user.Role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <select 
                      className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-colors"
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
