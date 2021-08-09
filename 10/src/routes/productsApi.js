import express from "express";
import { products } from "../class";
const router = express.Router();

// List's URL --> '/api/products/list'
router.get("/", (req, res) => {
    if (products.length == []) {
        return res.status(404).render({
            error: "The list is empty",
        });
    }
    res.render("productsList", { products });
});

// List's (sorted by ID) URL --> '/api/products/list/:id'
router.get("/list/:id", (req, res) => {
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

// Accessing saving product's form
router.get("/save", (req, res) => {
    res.render("saveProduct");
});

// Save product URL --> '/api/products/save'
router.post("/save", (req, res) => {
    const body = req.body;
    console.log(JSON.stringify(body));

    if (body == undefined) {
        return res.status(400).json({
            error: "Product cannot be added",
        });
    };

    const newProduct = {
        title:body.title,
        price: body.price,
        id: products.length + 1,
        thumbnail: body.thumbnail
    }

    products.push(newProduct)

    res.status(201).json({
        msg: "Product added successfully!",
        data: newProduct
    });
});

// Updating product URL --> '/api/products/update/:id'
router.put("/update/:id", (req, res) => {
    const updateID = parseInt(req.params.id);
    const body = req.body;
    const productsID = products.findIndex((index) => index.id == updateID);

    if (productsID != -1) {
        products.splice(productsID, 1, body);
    } else {
        return res.status(400).json({
            error: "ID not found",
            updateID,
        });
    }
    res.status(201).json({
        msg: "Product info has been updated successfully",
        data: body,
        products,
    });
});

// Deleting product URL --> '/api/products/delete/:id'
router.delete("/delete/:id", (req, res) => {
    const deleteID = parseInt(req.params.id);
    const productsID = products.findIndex((index) => index.id == deleteID);

    if (productsID != -1) {
        products.splice(productsID, 1);
    } else {
        return res.status(400).json({
            error: "ID does not exist",
            deleteID,
        });
    }
    res.status(201).json({
        msg: "Product deleted successfully",
        data: products,
    });
});

export default router;