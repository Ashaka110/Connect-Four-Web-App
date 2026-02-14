import { Pool } from "pg";

async function createTables(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lobbies (
      id UUID PRIMARY KEY,
      code VARCHAR(4) UNIQUE NOT NULL,
      status TEXT NOT NULL, -- waiting | active | finished
      player_one_id UUID,
      player_two_id UUID,
      player_one_name TEXT,
      player_two_name TEXT,
      state JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

export default createTables;
