const fs = require("fs");

class TicketManager {
  #priceBaseGain = 0.15;
  constructor() {
    this.events = [];
  }

  addEvent(name, site, price, capacity = 50, date = new Date()) {
    const event = {
      id: this.#getMaxId() + 1,
      name,
      site,
      capacity,
      price: price + price * this.#priceBaseGain,
      date,
      participants: [],
    };
    this.events.push(event);
  }

  #getMaxId() {
    let maxId = 0;
    this.events.map((event) => {
      if (event.id > maxId) maxId = event.id;
    });
    return maxId;
  }

  getEvents() {
    return this.events;
  }

  getEventById(eventId) {
    return this.events.find((event) => event.id === eventId);
  }

  addUser(eventId, userId) {
    const event = this.getEventById(eventId);
    if (event) {
      if (!event.participants.includes(userId)) {
        event.participants.push(userId);
      } else {
        return "this event does not exist";
      }
    }
  }

  eventTour(eventId, newSite, newDate) {
    const event = this.getEventById(eventId);
    if (event) {
      const newEvent = {
        ...event,
        id: this.#getMaxId() + 1,
        site: newSite,
        date: newDate,
        participants: [],
      };
      this.events.push(newEvent);
    } else {
      return "this event does not exist";
    }
  }
}

const ticketManager = new TicketManager();

// ticketManager.addEvent("Lolapalooza", "Rosario", 80000);
// ticketManager.addUser(1, "Mauro");
// ticketManager.addUser(1, "Cande");
// ticketManager.eventTour(1, "Cordoba", new Date("2023-10-30"));
// ticketManager.addUser(2, "Mauro");
// ticketManager.addUser(2, "Cande");

// console.log(ticketManager.getEvents());

class ProductManager {
  constructor() {
    this.products = [];
  }
  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("All fields must be completed.");
    }

    if (this.products.some((product) => product.code === code)) {
      throw new Error("Code already exists. It must be unique.");
    }

    const product = {
      id: this.#getMaxId() + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);
  }

  #getMaxId() {
    let maxId = 0;
    this.products.map((product) => {
      if (product.id > maxId) maxId = product.id;
    });
    return maxId;
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find((product) => product.id === productId);
    return product || "Not found";
  }
}

const productManager = new ProductManager();

productManager.addProduct(
  "Cake",
  "Chocolate with strawberries",
  50,
  "https://placeimage.com",
  1,
  10
);
productManager.addProduct(
  "Muffin",
  "Vanilla muffin",
  10,
  "https://placeimage.com",
  2,
  10
);

console.log(productManager.getProducts());

console.log(productManager.getProductById(1));

class UserManager {
  constructor() {
    this.path = "./users.json";
  }
  async getUsers() {
    try {
      if (fs.existsSync(this.path)) {
        const users = await fs.promises.readFile(this.path, "utf-8");
        const res = JSON.parse(users);
        return res;
      } else return [];
    } catch (error) {
      console.log(error);
    }
  }

  async createUser(user) {
    try {
      const users = await this.getUsers();
      users.push(user);
      await fs.promises.writeFile(this.path, JSON.stringify(users));
    } catch (error) {
      console.log(error);
    }
  }
}

const userManager = new UserManager();

const user1 = {
  firstName: "Mauro",
  lastName: "Caffesse",
  age: 31,
  course: "Desarrollo Backend",
};

const user2 = {
  firstName: "Cande",
  lastName: "Leogrande",
  age: 25,
  course: "Desarrollo Backend",
};

const test = async () => {
  console.log("primer consulta", await userManager.getUsers());
  await userManager.createUser(user1);
  console.log("segunda consulta", await userManager.getUsers());
  await userManager.createUser(user2);
  console.log("tercera consulta", await userManager.getUsers());
};

test();
