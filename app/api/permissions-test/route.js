import pool from '../../lib/db';

export async function POST(req) {
  try {
    const { username, action, value } = await req.json();
    
    // جلب الرول والباسورد المشفر من قاعدة البيانات
    const [rows] = await pool.query(
      'SELECT Role, Encrypted_Password FROM Users_Data WHERE Username = ?', 
      [username]
    );
    
    if (!rows.length) return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), { status: 404 });

    const { Role: role, Encrypted_Password: hash } = rows[0];
    let allowed = false;

    // فحص الصلاحيات
    if (role === 'admin') allowed = true;
    else if (role === 'writer' && action === 'write') allowed = true;
    else if (role === 'reader' && action === 'read') allowed = true;

    if (!allowed) {
      return new Response(JSON.stringify({ error: `عذراً، صلاحيتك (${role}) لا تسمح بهذا الإجراء`, role }), { status: 403 });
    }

    // إذا كانت العملية قراءة، نرسل الهاش الخاص بالمستخدم
    if (action === 'read') {
      return new Response(JSON.stringify({ 
        result: "تم التحقق من صلاحية القراءة بنجاح.",
        role,
        hash // إرسال الباسورد المشفر هنا
      }), { status: 200 });
    } 
    
    else if (action === 'write') {
      await pool.query('REPLACE INTO Permissions_Test (Username, TestValue) VALUES (?, ?)', [username, value]);
      return new Response(JSON.stringify({ 
        result: `تمت عملية الكتابة بنجاح: ${value}`, 
        role 
      }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'طلب غير صالح' }), { status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطأ في السيرفر' }), { status: 500 });
  }
}
