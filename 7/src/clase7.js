import express from "express";
import path from "path";

const fs = require("fs/promises");
const myFile = path.resolve(__dirname, "./../data/products.txt");

const PORT = 8080;
const app = express();

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const fn = () => {
    const data = fs.readFile(myFile, "utf8");
    return data;
};

const server = app.listen(PORT, () =>
    console.log("Server running on port ", PORT)
);

server.on("error", (err) => {
    console.log("ERROR =>", err);
});

let totalViews = 0;
let itemsView = 0;
let itemRandomView = 0;

// main URL --> "/"
app.get("/", (req, res) => {
    totalViews++;
    res.send(`User is able to visit '/items', '/item-random', '/visitas' routes.`);
});

// item's URL --> '/items'
app.get("/items", async (request, response) => {
    totalViews++;
    itemsView++;
    const products = await fn();
    const productsArray = JSON.parse(products, null, 2);
    const productsLength = productsArray.length;
    response.json({ products: productsArray, quantity: productsLength });
});

// random item's URL --> '/item-random'
app.get("/item-random", async (request, response) => {
    totalViews++;
    itemRandomView++;
    const products = await fn();
    const productsArray = JSON.parse(products, null, 2);
    const productsLength = productsArray.length;
    const random = getRandom(0, productsLength);
    response.json({ randomProduct: productsArray[random] });
});

// visit's URL --> '/visitas'
app.get("/visitas", (request, response) => {
    totalViews++;
    const visits = `Total amount of visits: ${totalViews}, /items route visits: ${itemsView}, /item-random route visits: ${itemRandomView} `;
    response.json({ visits });
});