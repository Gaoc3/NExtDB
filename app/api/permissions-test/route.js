import pool from '../../lib/db';

export async function POST(req) {
  try {
    const { username, action, value } = await req.json();
    
    // فحص الصلاحيات من جدول المستخدمين
    const [userRows] = await pool.query(
      'SELECT Role, Encrypted_Password FROM Users_Data WHERE Username = ?', 
      [username]
    );
    
    if (!userRows.length) return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), { status: 404 });

    const { Role: role, Encrypted_Password: hash } = userRows[0];
    let allowed = false;

    // تطبيق منطق الصلاحيات: الكاتب يكتب ويقرأ تلقائياً
    if (role === 'admin' || role === 'writer') allowed = true;
    else if (role === 'reader' && action === 'read') allowed = true;

    if (!allowed) {
      return new Response(JSON.stringify({ error: `صلاحيتك (${role}) لا تسمح بهذا العمل`, role, hash }), { status: 403 });
    }

    // --- تنفيذ العمليات ---
    if (action === 'read') {
      const [data] = await pool.query('SELECT TestValue FROM Permissions_Test WHERE Username = ?', [username]);
      return new Response(JSON.stringify({ 
        result: data[0]?.TestValue ? `[بيانات من DB]: ${data[0].TestValue}` : "لا توجد بيانات (انتهت الـ 10 ثوانٍ أو لم تكتب بعد)", 
        role, hash 
      }), { status: 200 });
    } 
    
    else if (action === 'write') {
      // 1. الحفظ في قاعدة البيانات
      await pool.query('REPLACE INTO Permissions_Test (Username, TestValue) VALUES (?, ?)', [username, value]);
      
      // 2. جلب القيمة فوراً من DB للتأكيد
      const [dbCheck] = await pool.query('SELECT TestValue FROM Permissions_Test WHERE Username = ?', [username]);
      const confirmedValue = dbCheck[0]?.TestValue;

      // 3. بدء مؤقت الحذف (10 ثوانٍ)
      setTimeout(async () => {
        try {
          await pool.query('DELETE FROM Permissions_Test WHERE Username = ?', [username]);
          console.log(`[CLEANUP] تم حذف بيانات ${username} بنجاح.`);
        } catch (e) { console.error(e); }
      }, 10000);

      return new Response(JSON.stringify({ 
        result: `تم الحفظ بنجاح! القيمة في DB الآن هي: "${confirmedValue}". ستختفي بعد 10 ثوانٍ.`, 
        role, hash 
      }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'طلب غير معروف' }), { status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطأ في السيرفر' }), { status: 500 });
  }
}
