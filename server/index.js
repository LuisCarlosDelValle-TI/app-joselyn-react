require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Get products (public)
app.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, image, price, stock FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// Checkout: expects { items: [{ productId, quantity }] }
app.post('/checkout', async (req, res) => {
  const { items } = req.body || {};
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'invalid items' });
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Check stock
    for (const it of items) {
      const pid = it.productId;
      const qty = parseInt(it.quantity, 10) || 1;
      const r = await client.query('SELECT stock FROM products WHERE id = $1 FOR UPDATE', [pid]);
      if (r.rowCount === 0) throw new Error(`product ${pid} not found`);
      const stock = r.rows[0].stock;
      if (stock < qty) throw new Error(`insufficient stock for product ${pid}`);
    }

    // Decrement stock and compute total
    let total = 0;
    for (const it of items) {
      const pid = it.productId;
      const qty = parseInt(it.quantity, 10) || 1;
      const r2 = await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2 RETURNING price', [qty, pid]);
      total += parseFloat(r2.rows[0].price) * qty;
    }

    // Simulate payment (always success in this minimal implementation)
    const payment = { success: true, provider: 'simulated' };

    // Create order record
    await client.query('INSERT INTO orders(items,total) VALUES($1,$2)', [JSON.stringify(items), total]);

    await client.query('COMMIT');

    res.json({ success: true, payment, total });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('checkout error', err.message || err);
    res.status(400).json({ error: err.message || 'checkout failed' });
  } finally {
    client.release();
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening on ${port}`));
