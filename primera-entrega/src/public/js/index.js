const socketClient = io();

const form = document.getElementById("form");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputPrice = document.getElementById("price");
const inputImage = document.getElementById("image");
const inputCode = document.getElementById("code");
const inputCategory = document.getElementById("category");
const inputStock = document.getElementById("stock");
const products = document.getElementById("products");

form.onsubmit = (e) => {
  e.preventDefault();
  const title = inputTitle.value;
  const description = inputDescription.value;
  const price = inputPrice.value;
  const image = inputImage.value;
  const code = inputCode.value;
  const category = inputCategory.value;
  const stock = inputStock.value;

  const product = {
    title,
    description,
    price,
    image,
    code,
    category,
    stock,
  };
  socketClient.emit("newProduct", product);
  inputTitle.value = "";
  inputDescription.value = "";
  inputPrice.value = "";
  inputImage.value = "";
  inputCode.value = "";
  inputCategory.value = "";
  inputStock.value = "";
};

socketClient.on("arrayProducts", (arrayP) => {
  let infoProducts = "<ul>";
  arrayP.forEach((p) => {
    infoProducts += `
      <li>Title: ${p.title}</li>
      <li> Description: ${p.description}</li>
      <li> Price: $${p.price}</li>
      <li> Image: ${p.image}</li>
      <li> Code: ${p.code}</li>
      <li> Category: ${p.category}</li>
      <li> Stock: ${p.stock}</li>
      </br>
      `;
  });
  products.innerHTML = infoProducts;
});
