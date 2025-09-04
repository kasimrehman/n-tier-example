const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool();

// Create order
app.post('/orders', async (req, res) => {
  const { productName, quantity, date, time, buyer } = req.body;
  if (!productName || !quantity || !date || !time || !buyer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO orders (product_name, quantity, date, time, buyer) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [productName, quantity, date, time, buyer]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all orders
app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one order
app.get('/orders/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order
app.put('/orders/:id', async (req, res) => {
  const { productName, quantity, date, time, buyer } = req.body;
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    if (productName) { fields.push(`product_name = $${idx++}`); values.push(productName); }
    if (quantity) { fields.push(`quantity = $${idx++}`); values.push(quantity); }
    if (date) { fields.push(`date = $${idx++}`); values.push(date); }
    if (time) { fields.push(`time = $${idx++}`); values.push(time); }
    if (buyer) { fields.push(`buyer = $${idx++}`); values.push(buyer); }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE orders SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete order
app.delete('/orders/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Order API listening at http://0.0.0.0:${port}`);
});
