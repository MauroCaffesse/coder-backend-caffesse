import express from "express";
import { ProductManager } from "./manager/ProductManager.js";

const productManager = new ProductManager("./src/products.json");

const app = express();

app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const { limit } = req.query;
    if (limit) {
      const productLimit = products.slice(0, parseInt(limit));
      res.status(200).json(productLimit);
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProductById(parseInt(id));
    if (!product)
      return res
        .status(404)
        .json({ message: `Product with od ${id} not found` });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

const PORT = 8080;

app.listen(PORT, () => console.log(`Server OK on port ${PORT}`));
