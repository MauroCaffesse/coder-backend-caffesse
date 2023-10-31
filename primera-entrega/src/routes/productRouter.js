import { Router } from "express";
import { ProductManager } from "../manager/ProductManager.js";

const router = Router();

const productManager = new ProductManager("./src/products.json");

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
  try {
    const { title, price, description, thumbnail, code, stock } = req.body;
    console.log(title, price, description, thumbnail, code, stock);
    const productCreated = await productManager.addProduct(
      title,
      price,
      description,
      thumbnail,
      code,
      stock
    );
    res.status(200).json(productCreated);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
  try {
    const product = { ...req.body };
    const { id } = req.params;
    const idNumber = parseInt(id);
    const productFound = await productManager.getProductById(idNumber);
    if (!productFound)
      return res.status(404).json({ message: "Product not found" });
    const updatedProduct = await productManager.updateProduct(
      idNumber,
      product
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const idNumber = parseInt(id);
    const productDeleted = await productManager.deleteProduct(idNumber);
    res.status(200).json({
      productDeleted,
      message: `Product with id ${id} deleted`,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

export default router;
