const moment = require("moment");

const hoy = moment();

console.log(`Fecha de hoy: ${hoy}`);
console.log(hoy.format("MMMM Do YYYY, h:mm a"));
console.log(moment("1992-08-31", "YYYY-MM-DD"));

console.log(hoy.diff(moment("1992-08-31", "YYYY-MM-DD"), "days"));
