import pool from '../../lib/db';

export async function POST(req) {
  try {
    const { username, action, value } = await req.json();
    const [userRows] = await pool.query('SELECT Role, Encrypted_Password FROM Users_Data WHERE Username = ?', [username]);
    
    if (!userRows.length) return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), { status: 404 });

    const { Role: role, Encrypted_Password: hash } = userRows[0];
    let allowed = (role === 'admin' || role === 'writer' || (role === 'reader' && action === 'read'));

    if (!allowed) return new Response(JSON.stringify({ error: `صلاحيتك (${role}) لا تسمح بهذا العمل`, role, hash }), { status: 403 });

    if (action === 'read') {
      const [data] = await pool.query('SELECT TestValue FROM Permissions_Test WHERE Username = ?', [username]);
      return new Response(JSON.stringify({ 
        result: data[0]?.TestValue || "لا توجد بيانات محفوظة", role, hash 
      }), { status: 200 });
    } 

    if (action === 'write') {
      await pool.query('REPLACE INTO Permissions_Test (Username, TestValue) VALUES (?, ?)', [username, value]);
      
      // جلب القيمة فوراً للتأكد من تسجيلها
      const [dbCheck] = await pool.query('SELECT TestValue FROM Permissions_Test WHERE Username = ?', [username]);
      
      // الحذف التلقائي بعد 10 ثوانٍ
      setTimeout(async () => {
        await pool.query('DELETE FROM Permissions_Test WHERE Username = ?', [username]);
      }, 10000);

      return new Response(JSON.stringify({ 
        result: dbCheck[0]?.TestValue, role, hash, note: "سيتم الحذف بعد 10 ثوانٍ"
      }), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطأ في السيرفر' }), { status: 500 });
  }
}
