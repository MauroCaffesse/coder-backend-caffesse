import fs from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const res = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(res);
        return carts;
      } else return [];
    } catch (error) {
      console.log(error);
    }
  }

  async #getMaxId() {
    try {
      const carts = await this.getCarts();
      return carts.reduce(
        (maxId, cart) => (cart.id > maxId ? cart.id : maxId),
        0
      );
    } catch (error) {
      console.log(error);
    }
  }

  async createCart() {
    try {
      const maxId = await this.#getMaxId();
      const cart = {
        id: maxId + 1,
        products: [],
      };
      const cartsFile = await this.getCarts();
      cartsFile.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const foundCart = carts.find((cart) => cart.id === id);
      return foundCart || `Cart with id '${id}' not found`;
    } catch (error) {
      console.log(error);
    }
  }

  async saveProductInCart(idCart, idProd) {
    try {
      const carts = await this.getCarts();
      const cartExists = await this.getCartById(idCart);

      if (cartExists) {
        const existsProductInCart = cartExists.products.find(
          (prod) => prod.product === idProd
        );

        if (existsProductInCart) {
          existsProductInCart.quantity += 1;
        } else {
          const product = {
            product: idProd,
            quantity: 1,
          };
          cartExists.products.push(product);
        }

        const cartIndex = carts.findIndex((cart) => cart.id === idCart);

        if (cartIndex !== -1) {
          carts[cartIndex] = cartExists;

          await fs.promises.writeFile(this.path, JSON.stringify(carts));
          return cartExists;
        } else {
          return `Cart with id ${idCart} not found`;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
