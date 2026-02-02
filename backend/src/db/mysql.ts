import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,
  namedPlaceholders: true,
});

export async function query<T = any>(sql: string, params?: Record<string, any>) {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

export async function getConnection() {
  return pool.getConnection();
}
