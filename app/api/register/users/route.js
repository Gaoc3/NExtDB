import pool from '../../../lib/db';

export const dynamic = 'force-dynamic'; // لإجبار السيرفر على تحديث البيانات

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT ID, Username, Email, Encrypted_Password, Role, Created_At FROM Users_Data');
    return new Response(JSON.stringify(rows), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Database Error' }), { status: 500 });
  }
}