import pool from '../../lib/db';

export async function POST(req) {
  try {
    const { username, action, value } = await req.json();
    
    // جلب البيانات الأساسية للتحقق
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
      return new Response(JSON.stringify({ 
        error: `عذراً، صلاحيتك كـ (${role}) لا تسمح بهذا العمل`, 
        role,
        Encrypted_Password,
        Created_At
      }), { status: 403 });
    }

    // تنفيذ عمليات الاختبار
    if (action === 'read') {
      const [data] = await pool.query('SELECT TestValue FROM Permissions_Test WHERE Username = ?', [username]);
      return new Response(JSON.stringify({ 
        result: data[0]?.TestValue ? `[بيانات من DB]: ${data[0].TestValue}` : "لا توجد بيانات (ربما انتهت الـ 10 ثوانٍ)", 
        role,
        Encrypted_Password,
        Created_At
      }), { status: 200 });
    } 
    
    else if (action === 'write') {
      // 1. إضافة السجل للداتا بيس
      await pool.query('REPLACE INTO Permissions_Test (Username, TestValue) VALUES (?, ?)', [username, value]);
      
      // 2. ضبط الحذف التلقائي بعد 10 ثوانٍ (10000ms)
      setTimeout(async () => {
        try {
          await pool.query('DELETE FROM Permissions_Test WHERE Username = ?', [username]);
          console.log(`[Auto-Delete] تم حذف سجل المستخدم ${username} بنجاح.`);
        } catch (err) {
          console.error('فشل الحذف التلقائي:', err);
        }
      }, 10000);

      return new Response(JSON.stringify({ 
        result: `تم الحفظ بنجاح: "${value}". سيتم حذف السجل من الداتا بيس بعد 10 ثوانٍ.`, 
        role,
        Encrypted_Password,
        Created_At
      }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'طلب غير معروف' }), { status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطأ داخلي في الخادم' }), { status: 500 });
  }
}
