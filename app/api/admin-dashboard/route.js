import pool from '../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  // فقط الأدمن يمكنه الوصول (تحقق بسيط بالاستعلام)
  // في مشروع حقيقي استخدم JWT أو Session
  const url = new URL(globalThis.location ? globalThis.location.href : '', 'http://localhost');
  const username = url.searchParams.get('username');
  if (username !== 'root') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
  }
  const [rows] = await pool.query('SELECT ID, Username, Email, Role FROM Users_Data');
  return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req) {
  // body: { username, role }
  const { username, role } = await req.json();
  if (!username || !role) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  if (username === 'root') return new Response(JSON.stringify({ error: 'Cannot change root role' }), { status: 403 });
  await pool.query('UPDATE Users_Data SET Role = ? WHERE Username = ?', [role, username]);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
