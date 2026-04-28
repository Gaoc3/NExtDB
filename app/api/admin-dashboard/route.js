import pool from '../../lib/db';

export async function POST(req) {
  const { username, action, value } = await req.json();
  

  const [rows] = await pool.query('SELECT Role FROM Users_Data WHERE Username = ?', [username]);
  if (!rows.length) return new Response(JSON.stringify({ error: 'المستخدم غير موجود في النظام' }), { status: 404 });

  const role = rows[0].Role;
  let allowed = false;


  if (role === 'admin') allowed = true;
  else if (role === 'writer' && (action === 'write' || action === 'read')) allowed = true;
  else if (role === 'reader' && action === 'read') allowed = true;

  if (!allowed) {
    return new Response(JSON.stringify({ error: 'عذراً، لا تمتلك الصلاحية الكافية لهذه العملية', role }), { status: 403 });
  }


  if (action === 'read') {
    const [data] = await pool.query('SELECT TestValue FROM Permissions_Test WHERE Username = ?', [username]);
    const secretContent = data[0]?.TestValue || "لا يوجد محتوى محفوظ حالياً لهذا المستخدم.";
    return new Response(JSON.stringify({ 
      result: `[محتوى خاص]: ${secretContent}`, 
      role 
    }), { status: 200 });
  } 
  

  else if (action === 'write') {
    // تحديث القيمة في الجدول المخصص للاختبار
    await pool.query('REPLACE INTO Permissions_Test (Username, TestValue) VALUES (?, ?)', [username, value]);
    return new Response(JSON.stringify({ 
      result: `تم حفظ البيانات الجديدة بنجاح: "${value}"`, 
      role 
    }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'عملية غير معروفة', role }), { status: 400 });
}