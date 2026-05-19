const express = require('express');
const app = express();
app.use(express.json());

// In-memory "database" for now
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// GET all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET one user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST - create a user
app.post('/users', (req, res) => {
  const newUser = { id: Date.now(), name: req.body.name };
  users.push(newUser);
  res.status(201).json(newUser);
});

// DELETE a user
app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id !== Number(req.params.id));
  res.status(204).send();
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));
