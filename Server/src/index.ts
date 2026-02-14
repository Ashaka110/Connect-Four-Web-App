
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import createTables from './migration';

const app = express();
const port = 5000;


// Middleware
app.use(express.json());
app.use(cors());


// Set up PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'myapp',  // replace with your DB name
  password: 'postgres',  // replace with your password
  port: 5432,
});

// Example route: Get all users from the database
app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Example route: Add a new user to the database
app.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



console.log("hello from index.ts");
console.log("hello from index.ts");
console.log("hello from index.ts");

function test(): void {
  console.log(process.env.TEST_VALUE);
}
console.log("hello from index.ts");

test();



async function start() {
    await createTables(pool);
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

start();
