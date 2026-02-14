import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { createInitialState } from "./game";

async function createLobby(pool: Pool) {
  for (let i = 0; i < 5; i++) {
    const code = generateCode();

    try {
      const result = await pool.query(
        "INSERT INTO lobbies (id, code, status, state) VALUES ($1,$2,$3,$4) RETURNING *",
        [uuidv4(), code, "waiting", createInitialState()],
      );

      return result.rows[0].code;
    } catch (err: any) {
      if (err.code !== "23505") throw err; // not unique violation
    }
  }

  throw new Error("Failed to generate unique code");
}

const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function generateCode(): string {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += LETTERS[Math.floor(Math.random() * LETTERS.length)];
  }
  return code;
}

export default createLobby;
