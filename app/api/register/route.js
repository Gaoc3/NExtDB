import pool from '../../lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    // 1. منع التكرار (Data Integrity)
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

    // 3. التشفير (Confidentiality)
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 4. منع SQL Injection
    await pool.execute(
      'INSERT INTO Users_Data (Username, Email, Encrypted_Password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    return new Response(JSON.stringify({ message: 'تم التسجيل بنجاح وأمان' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطأ في قاعدة البيانات' }), { status: 500 });
  }
}