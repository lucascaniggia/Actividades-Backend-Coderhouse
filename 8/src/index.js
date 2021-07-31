import express from "express";
import { products } from "./class";
import { Product } from "./class";

// Server Initializing

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => console.log("Server running on port ", PORT));

server.on("error", (err) => {
    console.log("Server Error", err);
});

// Routes

app.use(express.json({type: '*/*'}));
app.use(express.urlencoded({ extended: true }));

// Main route --> '/'
app.get("/", (req, res) => {
    res.json(
        `Available routes:
            /api/products/list => returns an array with list of all products
            /api/products/list/:id => returns a product by ID
            /api/products/save/ => saves a product on list`
    );
});

// List's URL --> '/api/products/list'
app.get("/api/products/list", (req, res) => {
    if (products.length == []) {
        return res.status(404).json({
            error: "The list is empty",
        });
    }
    res.json(products);
});

// List's (sorted by ID) URL --> '/api/products/list/:id'
app.get("/api/products/list/:id", (req, res) => {
    const searchID = req.params.id;
    const product = products.find((itemId) => itemId.id == searchID);

    if (!product) {
        return res.status(404).json({
            error: "Product not found",
        });
    }
    res.json({
        data: product,
    });
});

// Save product URL --> '/api/products/save'
app.post("/api/products/save", (req, res) => {
    const body = req.body;
    console.log(req.body);

    if (body == {}) {
        return res.status(400).json({
            error: "Product cannot be added",
        });
    };

    const newProduct = {
        title:body.title,
        price: body.price,
        id: products.length + 1
    }

    products.push(newProduct)

    res.status(201).json({
        msg: "Product added successfully!",
        data: newProduct
    })
});