import pool from '../../lib/db';

export async function POST(req) {
  try {
    const { username, action, value } = await req.json();
    
    // جلب الرول مع الباسورد المشفر وتاريخ الانضمام لضمان عمل الواجهة
    const [rows] = await pool.query(
      'SELECT Role, Encrypted_Password, Created_At FROM Users_Data WHERE Username = ?', 
      [username]
    );
    
    if (!rows.length) return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), { status: 404 });

    const { Role: role, Encrypted_Password, Created_At } = rows[0];
    let allowed = false;

    // فحص الصلاحيات
    if (role === 'admin') allowed = true;
    else if (role === 'writer' && action === 'write') allowed = true;
    else if (role === 'reader' && action === 'read') allowed = true;

    if (!allowed) {
      return new Response(JSON.stringify({ error: `صلاحيتك (${role}) لا تسمح بهذا العمل`, role }), { status: 403 });
    }

    // تنفيذ العمليات
    if (action === 'read') {
      const [data] = await pool.query('SELECT TestValue FROM Permissions_Test WHERE Username = ?', [username]);
      return new Response(JSON.stringify({ 
        result: `[محتوى DB]: ${data[0]?.TestValue || 'فارغ'}`, 
        role,
        Encrypted_Password, // إرسالها للواجهة لمنع الخطأ
        Created_At
      }), { status: 200 });
    } else if (action === 'write') {
      await pool.query('REPLACE INTO Permissions_Test (Username, TestValue) VALUES (?, ?)', [username, value]);
      return new Response(JSON.stringify({ 
        result: `تم الحفظ بنجاح: ${value}`, 
        role,
        Encrypted_Password,
        Created_At
      }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'طلب غير صالح' }), { status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطأ في السيرفر' }), { status: 500 });
  }
}
