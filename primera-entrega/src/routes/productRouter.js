import { Router } from "express";
import { ProductManager } from "../manager/ProductManager.js";
import { productValidator } from "../middlewares/productValidator.js";

const router = Router();

const productManager = new ProductManager("./src/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const { limit } = req.query;
    if (!limit) res.status(200).json(products);
    else {
      const limitedProducts = await productManager.getProductsByLimit(limit);
      res.status(200).json(limitedProducts);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/", productValidator, async (req, res) => {
  try {
    const productCreated = await productManager.addProduct(req.body);
    res.status(200).json(productCreated);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const idNumber = parseInt(id);
    const product = await productManager.getProductById(idNumber);
    if (!product)
      return res
        .status(404)
        .json({ message: `Product with id ${id} not found` });
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
