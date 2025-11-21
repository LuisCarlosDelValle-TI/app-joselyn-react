const db = require('./db');

async function init() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        price NUMERIC(12,2) NOT NULL DEFAULT 0,
        stock INTEGER NOT NULL DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        items JSONB NOT NULL,
        total NUMERIC(12,2) NOT NULL
      );
    `);

    // Seed products if table empty
    const res = await client.query('SELECT COUNT(*) FROM products');
    const count = parseInt(res.rows[0].count, 10);
    if (count === 0) {
      const sample = [];
      for (let i = 1; i <= 15; i++) {
        sample.push({
          name: `Producto ${i}`,
          image: `https://picsum.photos/seed/p${i}/300/300`,
          price: (Math.round((Math.random() * 100 + 10) * 100) / 100),
          stock: 1 + Math.floor(Math.random() * 10)
        });
      }

      for (const p of sample) {
        await client.query('INSERT INTO products(name,image,price,stock) VALUES($1,$2,$3,$4)', [p.name, p.image, p.price, p.stock]);
      }
      console.log('Seeded products');
    } else {
      console.log('Products exist, skipping seed');
    }

    await client.query('COMMIT');
    console.log('DB initialized');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('DB init error', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

init().catch(err => {
  console.error(err);
  process.exit(1);
});
