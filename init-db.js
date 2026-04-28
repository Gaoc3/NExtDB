import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// fix ES module path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// التحقق من متغيرات البيئة
const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
}

// قراءة شهادة CA
const caCert = fs.readFileSync(path.join(__dirname, 'ca.pem'));

// SQL table creation
const sql = `
CREATE TABLE IF NOT EXISTS Users_Data (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(255) NOT NULL,
  Email VARCHAR(255) NOT NULL UNIQUE,
  Encrypted_Password VARCHAR(255) NOT NULL,
  Role VARCHAR(50) DEFAULT 'user',
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// إعداد الاتصال
const options = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    ca: caCert,
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
};

// التنفيذ
(async () => {
  let connection;

  try {
    connection = await mysql.createConnection(options);

    console.log('✅ Connected to MySQL');

    await connection.execute(sql);

    console.log('✅ Table created or already exists');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    if (connection) await connection.end();
  }
})();