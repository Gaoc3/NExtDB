import pool from '../../lib/db';

export async function POST(req) {
  const { username, action, value } = await req.json();
  const [rows] = await pool.query('SELECT Role FROM Users_Data WHERE Username = ?', [username]);
  if (!rows.length) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

  const role = rows[0].Role;
  let allowed = false;
  if (role === 'admin') allowed = true;
  else if (role === 'writer' && (action === 'write' || action === 'read')) allowed = true;
  else if (role === 'reader' && action === 'read') allowed = true;

  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Permission denied', role }), { status: 403 });
  }

  if (action === 'read') {
    const [data] = await pool.query('SELECT TestValue FROM Permissions_Test WHERE Username = ?', [username]);
    return new Response(JSON.stringify({ result: data[0]?.TestValue || '', role }), { status: 200 });
  } else if (action === 'write') {
    await pool.query('REPLACE INTO Permissions_Test (Username, TestValue) VALUES (?, ?)', [username, value]);
    return new Response(JSON.stringify({ result: 'Value written successfully', role }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Unknown action', role }), { status: 400 });
}

export const dynamic = 'force-dynamic';
