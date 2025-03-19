const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'supersecret';

app.use(bodyParser.json());
const db = new sqlite3.Database(':memory:');

// Create products table
db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    imageUrl TEXT
)`);

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password123') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ error: 'Invalid credentials' });
});

// Get all products
app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get a product by ID
app.get('/products/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Product not found' });
        res.json(row);
    });
});

// Create a product (Protected)
app.post('/products', authenticateToken, (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Name and price required' });
    db.run('INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)',
        [name, description, price, imageUrl], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, description, price, imageUrl });
        });
});

// Update a product (Protected)
app.put('/products/:id', authenticateToken, (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    db.run('UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?',
        [name, description, price, imageUrl, req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product updated' });
        });
});

// Delete a product (Protected)
app.delete('/products/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
