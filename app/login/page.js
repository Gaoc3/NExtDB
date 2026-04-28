"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("");
    // تحقق من اسم المستخدم وكلمة المرور
    if (username === "root" && password === "root") {
      setStatus("Logging in as admin ...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      // يمكنك هنا ربطه بقاعدة البيانات لاحقاً
      setStatus("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4">
      <div className="bg-gray-900/90 border border-blue-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-400 drop-shadow-lg tracking-wide">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input type="text" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold shadow-lg transition-all">Login</button>
        </form>
        {status && (
          <div className={`mt-6 p-4 rounded-lg text-sm border ${status.includes('admin') ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-red-900/30 border-red-500 text-red-400'}`}>{status}</div>
        )}
      </div>
    </div>
  );
}
