Set Up Project → Installed express, sqlite3, jsonwebtoken, body-parser.
Created SQLite Database → In-memory DB with a products table.
Built API Endpoints:
GET /products → Fetch all products
GET /products/:id → Fetch one product
POST /products (Protected) → Add a product
PUT /products/:id (Protected) → Update a product
DELETE /products/:id (Protected) → Remove a product
Implemented JWT Authentication →
POST /login → Returns a JWT token
Middleware protects product creation, update, and delete routes