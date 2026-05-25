import Database from 'better-sqlite3';
import express from 'express';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());

// Use database
const db = new Database('users.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`);

// GET all users
app.get('/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// GET one user by ID
app.get('/users/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST - create a user
app.post('/users', (req, res) => {
  const result = db.prepare('INSERT INTO users (name) VALUES (?)').run(req.body.name);
  const newUser = { id: result.lastInsertRowid, name: req.body.name };
  res.status(201).json(newUser);
});

// PUT - update a user
app.put('/users/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(req.body.name, req.params.id);
  res.json({ id: user.id, name: req.body.name });
});


// DELETE a user
app.delete('/users/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));
