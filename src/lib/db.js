import { Pool } from 'pg';
const pool = new Pool({
    host: import.meta.env.VITE_HOSTNAME,
    port: import.meta.env.VITE_PORT,
    user: import.meta.env.VITE_USER,
    password: import.meta.env.VITE_PASSWORD,
    database: import.meta.env.VITE_DATABASE
});

export async function query(text, params) {
    const res = await pool.query(text, params);
    return res.rows;
}
