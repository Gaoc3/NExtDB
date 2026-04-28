import pool from '../../lib/db';

export async function POST(req) {
  try {
    const { username, action, value } = await req.json();
    const [rows] = await pool.query('SELECT Role FROM Users_Data WHERE Username = ?', [username]);
    
    if (!rows.length) return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), { status: 404 });

    const role = rows[0].Role;
    let allowed = false;

    // 🛡️ الصلاحيات: الأدمن يملك الكل، الكاتب يكتب فقط، القارئ يقرأ فقط
    if (role === 'admin') {
      allowed = true; 
    } else if (role === 'writer' && action === 'write') {
      allowed = true;
    } else if (role === 'reader' && action === 'read') {
      allowed = true;
    }

    if (!allowed) {
      return new Response(JSON.stringify({ error: `عذراً، صلاحيتك كـ (${role}) لا تسمح بهذا الطلب`, role }), { status: 403 });
    }

    if (action === 'read') {
      const [data] = await pool.query('SELECT TestValue FROM Permissions_Test WHERE Username = ?', [username]);
      return new Response(JSON.stringify({ result: `[محتوى DB]: ${data[0]?.TestValue || 'فارغ'}`, role }), { status: 200 });
    } else if (action === 'write') {
      await pool.query('REPLACE INTO Permissions_Test (Username, TestValue) VALUES (?, ?)', [username, value]);
      return new Response(JSON.stringify({ result: `تم تحديث البيانات بنجاح إلى: ${value}`, role }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'طلب غير صالح', role }), { status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطأ داخلي في الخادم' }), { status: 500 });
  }
}