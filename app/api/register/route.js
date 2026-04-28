import pool from '../../lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    // 1. منع التكرار
    const [existing] = await pool.execute(
      'SELECT ID FROM Users_Data WHERE Username = ? OR Email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: 'اسم المستخدم أو البريد مسجل مسبقاً' }), { status: 400 });
    }

    // 2. سياسة كلمة المرور
    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'كلمة المرور يجب أن تكون 8 رموز فأكثر' }), { status: 400 });
    }

    // 3. التشفير
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 🚨 4. تحديد الصلاحية الافتراضية 🚨
    const defaultRole = 'reader';

    // 5. إدخال البيانات مع حقل الصلاحية (Role)
    await pool.execute(
      'INSERT INTO Users_Data (Username, Email, Encrypted_Password, Role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, defaultRole]
    );

    return new Response(JSON.stringify({ message: 'تم التسجيل بنجاح بصلاحية (قارئ)' }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'خطأ في قاعدة البيانات' }), { status: 500 });
  }
}