import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Pool } from "pg";

import createTables from "./migration";
import createLobby from "./matchmaking";

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Set up PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "myapp", // replace with your DB name
  password: "postgres", // replace with your password
  port: 5432,
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.post("/lobbies", async (_req, res) => {
  try {
    const code = await createLobby(pool);
    return res.json({ code });
  } catch (err: any) {
    res.status(500).json({ error: "Could not generate code" });
  }
});

app.post("/lobbies/join", async (req, res) => {
  const { code } = req.body;

  const result = await pool.query("SELECT * FROM lobbies WHERE code=$1", [
    code,
  ]);

  if (!result.rows.length)
    return res.status(404).json({ error: "Lobby not found" });

  res.json({ success: true });
});

io.on("connection", (socket) => {
  socket.on("joinLobby", async ({ code, name }) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        "SELECT * FROM lobbies WHERE code=$1 FOR UPDATE",
        [code],
      );

      if (!result.rows.length) {
        socket.emit("errorMessage", "Lobby not found");
        await client.query("ROLLBACK");
        return;
      }

      const lobby = result.rows[0];

      if (!lobby.player_one_name) {
        await client.query(
          "UPDATE lobbies SET player_one_name=$1 WHERE code=$2",
          [name, code],
        );
      } else if (!lobby.player_two_name) {
        await client.query(
          "UPDATE lobbies SET player_two_name=$1, status='active' WHERE code=$2",
          [name, code],
        );
      } else {
        socket.emit("errorMessage", "Lobby full");
        await client.query("ROLLBACK");
        return;
      }

      await client.query("COMMIT");

      socket.join(code);

      const updated = await pool.query(
        "SELECT player_one_name, player_two_name FROM lobbies WHERE code=$1",
        [code],
      );

      io.to(code).emit("lobbyUpdate", updated.rows[0]);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
    } finally {
      client.release();
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on 3000");
});

async function start() {
  await createTables(pool);
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

start();
