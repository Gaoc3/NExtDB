import pool from '../../lib/db';

// جلب قائمة المستخدمين (حصرياً للروت)
export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT Username, Encrypted_Password, Created_At, Role FROM Users_Data'
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'فشل في جلب البيانات' }), { status: 500 });
  }
}

// تحديث صلاحية المستخدم
export async function PATCH(req) {
  try {
    const { username, newRole } = await req.json();
    await pool.query('UPDATE Users_Data SET Role = ? WHERE Username = ?', [newRole, username]);
    return new Response(JSON.stringify({ message: 'تم التحديث' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'فشل التحديث' }), { status: 500 });
  }
}
