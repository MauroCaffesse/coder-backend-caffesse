import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const res = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(res);
        return products;
      } else return [];
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(productId) {
    try {
      const products = await this.getProducts();
      const foundProduct = products.find((product) => product.id === productId);
      return foundProduct || `Product with id '${productId}' not found`;
    } catch (error) {
      console.log(error);
    }
  }
  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const products = await this.getProducts();
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("All fields must be completed.");
      }

      if (products.some((product) => product.code === code)) {
        throw new Error("Code already exists. It must be unique.");
      }
      const maxId = await this.#getMaxId();
      const product = {
        id: maxId + 1,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(productId, updatedFields) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex(
        (product) => product.id === productId
      );

      if (productIndex === -1) {
        throw new Error("Product not found");
      }

      products[productIndex] = {
        ...products[productIndex],
        ...updatedFields,
        id: productId,
      };
      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(productId) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex(
        (product) => product.id === productId
      );

      if (productIndex === -1) {
        throw new Error("Product not found");
      }
      products.splice(productIndex, 1);

      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      console.log(error);
    }
  }

  async #getMaxId() {
    try {
      const products = await this.getProducts();
      return products.reduce(
        (maxId, product) => (product.id > maxId ? product.id : maxId),
        0
      );
    } catch (error) {
      console.log(error);
    }
  }
}
