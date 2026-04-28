import pool from '../../lib/db';

export async function POST(req) {
  try {
    const { username, action, value } = await req.json();
    
    // جلب الرول من قاعدة البيانات
    const [rows] = await pool.query('SELECT Role FROM Users_Data WHERE Username = ?', [username]);
    if (!rows.length) return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), { status: 404 });

    const role = rows[0].Role;
    let allowed = false;

    // 🛡️ تطبيق الصلاحيات الصارمة 🛡️
    if (role === 'admin') {
      allowed = true; // الأدمن مسموح له كل شيء
    } 
    else if (role === 'writer' && action === 'write') {
      allowed = true; // الكاتب يكتب فقط
    } 
    else if (role === 'reader' && action === 'read') {
      allowed = true; // القارئ يقرأ فقط
    }

    // الرفض إذا لم تتحقق الشروط
    if (!allowed) {
      return new Response(JSON.stringify({ error: `عذراً، الصلاحية الخاصة بك (${role}) لا تسمح بهذه العملية`, role }), { status: 403 });
    }

    // --- تنفيذ العمليات المسموحة ---
    if (action === 'read') {
      const [data] = await pool.query('SELECT TestValue FROM Permissions_Test WHERE Username = ?', [username]);
      const secretContent = data[0]?.TestValue || "لا يوجد محتوى محفوظ حالياً لهذا المستخدم.";
      return new Response(JSON.stringify({ result: `[محتوى خاص]: ${secretContent}`, role }), { status: 200 });
    } 
    else if (action === 'write') {
      await pool.query('REPLACE INTO Permissions_Test (Username, TestValue) VALUES (?, ?)', [username, value]);
      return new Response(JSON.stringify({ result: `تم حفظ البيانات بنجاح: "${value}"`, role }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'عملية غير معروفة', role }), { status: 400 });

  } catch (error) {
    console.error("Permissions Test Error:", error);
    return new Response(JSON.stringify({ error: 'حدث خطأ في الخادم' }), { status: 500 });
  }
}

export const dynamic = 'force-dynamic';