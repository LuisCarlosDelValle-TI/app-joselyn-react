import express from 'express';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool{ connectionString: process.env.DATABASE_URL };

router.get('/', async (req, res) => {
    try {
        const sellerId = req.query.sellerId;
        if (!sellerId) return res.status(404).json({error: 'sellerId requerido'});

        const sql = `
        SELECT id, name, description, price, image_url, stock
        FROM products
        WHERW sellerId = $1 AND active = true
        ORDER BY created_at DESC
        LIMIT 100;
        `;
        const { rows } = await pool.query(sql, [sellerId]);
        return res.json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});

export default router;