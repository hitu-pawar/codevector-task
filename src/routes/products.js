const express = require("express");
const router = express.Router();
const pool = require("../db/db");

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const cursor = req.query.cursor;

    let query = `
      SELECT *
      FROM products
      WHERE 1=1
    `;

    const values = [];
    let index = 1;

    if (category) {
      query += ` AND category = $${index}`;
      values.push(category);
      index++;
    }

    if (cursor) {
      query += ` AND id < $${index}`;
      values.push(cursor);
      index++;
    }

    query += `
      ORDER BY created_at DESC, id DESC
      LIMIT $${index}
    `;

    values.push(limit);

    const result = await pool.query(query, values);

    res.json({
      products: result.rows,
      nextCursor:
        result.rows.length > 0
          ? result.rows[result.rows.length - 1].id
          : null,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;