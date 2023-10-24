const fs = require("fs");
const crypto = require("crypto");

class UserManager {
  constructor(path) {
    this.path = path;
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

  async createUser(obj) {
    try {
      const user = { ...obj };
      const users = await this.getUsers();
      user.salt = crypto.randomBytes(128).toString();
      user.password = crypto
        .createHmac("sha256", user.salt)
        .update(user.password)
        .digest("hex");
      users.push(user);
      await fs.promises.writeFile(this.path, JSON.stringify(users));
    } catch (error) {
      console.log(error);
    }
  }

  async validateUser(username, password) {
    try {
      const users = await this.getUsers();
      const user = users.find((usr) => usr.username === username);
      if (!user) console.log("Error: user or password not found");
      const passLoginCrypto = crypto
        .createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");
      if (user.password !== passLoginCrypto)
        return console.log("Error: user or password incorrect");
      console.log("Login OK!");
    } catch (error) {
      console.log(error);
    }
  }
}

const userManager = new UserManager("./users.json");

const user1 = {
  firstName: "Mauro",
  lastName: "Caffesse",
  username: "maurocaffesse",
  password: "123456",
};

const user2 = {
  firstName: "Cande",
  lastName: "Leogrande",
  username: "candeleogrande",
  password: "1234",
};

const test = async () => {
  // await userManager.createUser(user1);
  // await userManager.createUser(user2);
  // console.log(await userManager.getUsers());
  await userManager.validateUser("candeleogrande", "1234");
};

test();
