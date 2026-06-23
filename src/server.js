const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const pool = require("./db/db");
const productsRoute = require("./routes/products");

app.use(cors());
app.use(express.json());

app.use("/products", productsRoute);

app.get("/", (req, res) => {
  res.json({ message: "CodeVector Backend Running" });
});

const PORT = process.env.PORT || 5000;

pool.query("SELECT NOW()")
  .then(() => console.log("Database Connected ✅"))
  .catch((err) => console.error("Database Error ❌", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});