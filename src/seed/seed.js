const { faker } = require("@faker-js/faker");
const pool = require("../db/db");

const categories = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Furniture"
];

async function seedProducts() {
  try {
    const batchSize = 5000;
    const totalRecords = 200000;

    for (let i = 0; i < totalRecords; i += batchSize) {
      const values = [];
      const placeholders = [];

      for (let j = 0; j < batchSize; j++) {
        const index = j * 5;

        values.push(
          faker.commerce.productName(),
          categories[Math.floor(Math.random() * categories.length)],
          faker.commerce.price({ min: 100, max: 5000 }),
          faker.date.recent(),
          faker.date.recent()
        );

        placeholders.push(
          `($${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, $${index + 5})`
        );
      }

      await pool.query(
        `
        INSERT INTO products
        (name, category, price, created_at, updated_at)
        VALUES ${placeholders.join(",")}
        `,
        values
      );

      console.log(`Inserted ${i + batchSize} products`);
    }

    console.log("Seeding Complete ✅");
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

seedProducts();