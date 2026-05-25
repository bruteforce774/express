import Database from 'better-sqlite3';
const express = require('express');
const app = express();
app.use(express.json());

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
  const users = readUsers();
  res.json(users);
});

// GET one user by ID
app.get('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST - create a user
app.post('/users', (req, res) => {
  const users = readUsers();
  const newUser = { id: Date.now(), name: req.body.name };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

// PUT - update a user
app.put('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.name = req.body.name;
  writeUsers(users);
  res.json(user);
})

// DELETE a user
app.delete('/users/:id', (req, res) => {
  let users = readUsers();
  users = users.filter(u => u.id !== Number(req.params.id));
  writeUsers(users);
  res.status(204).send();
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));
