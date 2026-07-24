import mysql from "mysql2/promise";

// Single shared connection pool for the whole app. Reused across requests —
// don't create a new pool per request, that exhausts the DB's connection
// limit fast (shared MySQL hosting plans often cap this quite low).
let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // JSON columns (additional_info, images, sizes, items, razorpay,
      // shiprocket) come back already parsed into JS objects/arrays — no
      // manual JSON.parse needed when reading. Writing still needs an
      // explicit JSON.stringify (see lib usage).
    });
  }
  return pool;
}

// Run a parameterized query and get back just the rows (not the extra
// mysql2 metadata array wrapper).
export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

// MySQL DATETIME columns reject JS's native ISO format
// ("2026-07-24T10:41:41.539Z") — they need "2026-07-24 10:41:41" instead.
// Use this before inserting/updating any DATETIME column.
export function toMySQLDatetime(isoStringOrDate) {
  const d = isoStringOrDate instanceof Date ? isoStringOrDate : new Date(isoStringOrDate);
  return d.toISOString().slice(0, 19).replace("T", " ");
}
