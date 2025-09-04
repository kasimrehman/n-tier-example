# Node.js CRUD API for Orders

This is a simple Express-based API for managing orders. It supports create, read, update, and delete operations.

## Order Fields
- productName (string)
- quantity (number)
- date (string)
- time (string)
- buyer (string)

## Endpoints
- `POST /orders` — Create an order
- `GET /orders` — List all orders
- `GET /orders/:id` — Get a specific order
- `PUT /orders/:id` — Update an order
- `DELETE /orders/:id` — Delete an order

## Running Locally
```sh
npm install
npm start
```

The API will be available on port 8080.
