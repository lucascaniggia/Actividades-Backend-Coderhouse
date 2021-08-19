import express from "express";
import path from "path";
import * as http from "http";
import io from "socket.io"
import { products } from "./class";

// Server Initializing
const app = express();
const PORT = 8080;
const myServer = http.Server(app);
myServer.listen(PORT, () => console.log("Server running on port ", PORT));

myServer.on("error", (err) => {
    console.log("Server Error", err);
});

// Getting Public folder
const publicPath = path.resolve(__dirname, "./public");
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routers
// app.use("/api/products", productsApi);

// Routes

// Index
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/indexPage.html", { products });
});

// Saving products
app.post("/save", (req,res) => {
    const body = req.body;

    if (body == undefined) {
        return res.status(400).json({
            error: 'Product not found',
        });
    }

    const newProduct = {
        id: products.length + 1,
        title: body.title,
        price: body.price,
        thumbnail: body.thumbnail,
    };

    products.push(newProduct)
    console.log(publicPath)
    res.status(201).sendFile(`${publicPath}/index.html`, { products });
});

// Initializing WebSocket Server

const socketIoServer = io(myServer);

socketIoServer.on("connection", (socket) => {

    // Product List
    console.log("A new client is connected");
    socketIoServer.emit("Products", products);

    // Chat
    socket.emit("chatMessage", (message) => {
        console.log(message);
    });

    // Listening to chatMessage
    socket.on("chatMessage", (chat) => {
        console.log(chat);
        socket.broadcast.emit("message", chat);
    })
});