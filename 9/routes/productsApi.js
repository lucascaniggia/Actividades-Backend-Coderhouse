import express from "express";
import { products } from "../class";
const router = express.Router();

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