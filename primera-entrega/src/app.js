import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartsRouter.js";
import viewRouter from "./routes/viewsRouter.js";
import { ProductManager } from "./manager/ProductManager.js";
import { __dirname } from "./utils.js";

const productManager = new ProductManager("./src/products.json");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

const PORT = 8080;

const httpServer = app.listen(PORT, () =>
  console.log(`Server OK on port ${PORT}`)
);

export const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });

  socket.on("newProduct", async (product) => {
    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    socketServer.emit("arrayProducts", products);
  });
  const products = await productManager.getProducts();
  socketServer.emit("arrayProducts", products);
});
