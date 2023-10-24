import express from "express";
import { products } from "./products.js";
import { users } from "./users.js";

const app = express();

const user = "admin";

app.get("/", (req, res) => {
  res.send("Mi primer servidor con express");
});

app.get("/home", (req, res) => {
  res.send("Bienvenido/a");
});

app.get("/all-products", (req, res) => {
  res.json({ products });
});

app.get("/users", (req, res) => {
  // res.json({ users });
  if (user !== admin) return res.status(404).send("Error, access denied");
  res.status(200).json({ users });
});

app.get("/products", (req, res) => {
  console.log(req.query);
  const { value } = req.query;
  const productsFilter = products.filter(
    (prod) => prod.price >= parseInt(value)
  );
  res.json(productsFilter);
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const idProduct = products.find((prod) => prod.id === parseInt(id));
  if (!idProduct)
    return res
      .status(404)
      .json({ message: `Error: product with id ${id} not found` });
  res.json(idProduct);
});

const PORT = 8080;

app.listen(8080, () => console.log("Server OK on port 8080"));
