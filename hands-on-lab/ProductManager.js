const fs = require("fs");

class ProductManager {
  constructor() {
    this.path = "./products.json";
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

const productManager = new ProductManager();

const test = async () => {
  //---- create ----
  console.log(
    "crear producto",
    await productManager.addProduct(
      "Carrot cake",
      "Delicious cake made with selected carrots",
      14,
      "https://placeimage.com",
      4,
      7
    )
  );
  console.log(
    "crear producto",
    await productManager.addProduct(
      "Strawberry pie",
      "Strawberry pie",
      18,
      "https://placeimage.com",
      5,
      10
    )
  );
  console.log(
    "crear producto",
    await productManager.addProduct(
      "Macarons",
      "Macarons of diferent flavours",
      3,
      "https://placeimage.com",
      6,
      100
    )
  );

  //---- update/get by id ----

  // console.log("primera consulta", await productManager.getProductById(3));
  // console.log(
  //   "modificacion producto",
  //   await productManager.updateProduct(3, {
  //     title: "Muffin",
  //     description: "Vanilla muffin",
  //     price: 200,
  //     stock: 5,
  //   })
  // );
  // console.log("segunda consulta", await productManager.getProductById(3));

  // ---- delete ----

  // console.log("eliminar producto", productManager.deleteProduct(2));
};

test();
