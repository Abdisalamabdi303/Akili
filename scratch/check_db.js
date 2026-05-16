import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'aiuser',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ai_factory',
    password: process.env.DB_PASSWORD || 'aipassword',
    port: parseInt(process.env.DB_PORT || '5432'),
});

async function check() {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables:", res.rows.map(r => r.table_name));
        
        const chats = await pool.query("SELECT * FROM chats LIMIT 1");
        console.log("Chats count:", chats.rowCount);
        
        const messages = await pool.query("SELECT * FROM messages LIMIT 1");
        console.log("Messages count:", messages.rowCount);
    } catch (err) {
        console.error("DB Error:", err.message);
    } finally {
        await pool.end();
    }
}

check();
