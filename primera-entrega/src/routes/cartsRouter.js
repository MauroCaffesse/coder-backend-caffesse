import { Router } from "express";
import { CartManager } from "../manager/CartManager.js";
import { ProductManager } from "../manager/ProductManager.js";

const router = Router();

const cartManager = new CartManager("./src/carts.json");
const productManager = new ProductManager("./src/products.json");

router.post("/", async (req, res) => {
  try {
    const cartCreated = await cartManager.createCart(req.body);
    res.status(200).json(cartCreated);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cidNumber = parseInt(cid);
    const cart = await cartManager.getCartById(cidNumber);
    if (!cart)
      return res.status(404).json({ message: `Cart with id ${cid} not found` });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    const cidNumber = parseInt(cid);
    const pidNumber = parseInt(pid);
    const productExists = await productManager.getProductById(pidNumber);
    if (!productExists)
      return res.status(404).json(`Product with id ${pid} not found`);
    const productInCart = await cartManager.saveProductInCart(
      cidNumber,
      pidNumber
    );
    res.status(200).json(productInCart);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

export default router;
