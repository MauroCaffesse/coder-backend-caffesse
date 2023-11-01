import express from "express";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartsRouter.js";

const app = express();

app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

const PORT = 8080;

app.listen(PORT, () => console.log(`Server OK on port ${PORT}`));
