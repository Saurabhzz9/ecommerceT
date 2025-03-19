const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const SECRET_KEY = "your_secret_key";

// Initialize SQLite database
const db = new sqlite3.Database(":memory:");
db.serialize(() => {
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    imageUrl TEXT
  )`);
});

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password123") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// CRUD Routes for Products
app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/products/:id", (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Product not found" });
    res.json(row);
  });
});

app.post("/products", authenticateJWT, (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  if (!name || !price) return res.status(400).json({ error: "Missing fields" });

  db.run(
    "INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)",
    [name, description, price, imageUrl],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put("/products/:id", authenticateJWT, (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  db.run(
    "UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?",
    [name, description, price, imageUrl, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product updated" });
    }
  );
});

app.delete("/products/:id", authenticateJWT, (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted" });
  });
});

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
