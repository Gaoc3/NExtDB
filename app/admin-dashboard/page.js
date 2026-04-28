"use client";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [rootUser, setRootUser] = useState('root');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    const res = await fetch(`/api/admin-dashboard?username=${rootUser}`);
    const data = await res.json();
    if (res.ok) setUsers(data);
    else setError(data.error || 'Error fetching users');
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleRoleChange = async (username, newRole) => {
    setError(''); setSuccess('');
    const res = await fetch('/api/admin-dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, role: newRole })
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess('Role updated!');
      fetchUsers();
    } else {
      setError(data.error || 'Error updating role');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10 text-gray-100">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-400 drop-shadow-lg tracking-wide">Admin Dashboard</h1>
      {error && <div className="text-red-400 text-center mb-4 bg-red-900/40 p-3 rounded-lg border border-red-700">{error}</div>}
      {success && <div className="text-green-400 text-center mb-4 bg-green-900/40 p-3 rounded-lg border border-green-700">{success}</div>}
      
      <div className="max-w-5xl mx-auto bg-gray-900/80 shadow-2xl rounded-2xl overflow-hidden border border-blue-900/40 backdrop-blur-md overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gradient-to-l from-blue-900 via-blue-700 to-blue-800 text-blue-100">
            <tr>
              <th className="p-4 whitespace-nowrap">ID</th>
              <th className="p-4 whitespace-nowrap">Username</th>
              <th className="p-4 whitespace-nowrap">Email</th>
              <th className="p-4 whitespace-nowrap">Encrypted Password</th> {/* عمود الباسورد المشفر */}
              <th className="p-4 whitespace-nowrap">Role</th>
              <th className="p-4 whitespace-nowrap">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.ID} className="border-b border-gray-800 hover:bg-blue-900/30 transition-all">
                <td className="p-4">{u.ID}</td>
                <td className="p-4 font-bold text-blue-300">{u.Username}</td>
                <td className="p-4 text-gray-300">{u.Email}</td>
                {/* عرض الباسورد المشفر بخط صغير مع السماح بكسر النص */}
                <td className="p-4 text-xs text-gray-500 break-all max-w-[200px] font-mono">
                  {u.Encrypted_Password}
                </td>
                <td className="p-4 text-green-400">{u.Role}</td>
                <td className="p-4">
                  <select
                    className="bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:border-blue-500 outline-none cursor-pointer"
                    value={u.Role}
                    disabled={u.Username === 'root'}
                    onChange={e => handleRoleChange(u.Username, e.target.value)}
                  >
                    <option value="admin">admin</option>
                    <option value="writer">writer</option>
                    <option value="reader">reader</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}