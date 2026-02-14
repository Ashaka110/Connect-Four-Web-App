import { Pool } from 'pg';

async function createTables(pool : Pool){

 await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL
    );
  `);
}

export default createTables;
