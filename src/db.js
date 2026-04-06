import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;

dotenv.config();

// Use environment variables with fallback to defaults
export const pool = new Pool({
    user: process.env.DB_USER || 'aiuser',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ai_factory',
    password: process.env.DB_PASSWORD || 'aipassword',
    port: parseInt(process.env.DB_PORT || '5432'),
});
