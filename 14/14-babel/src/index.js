import express from "express";
import path from "path";
import * as http from "http";
import io from "socket.io"
import { products } from "./class";
import moment from "moment";
import fs from "fs";

// Server Initializing
const app = express();
const PORT = 8080;
const myServer = http.Server(app);
myServer.listen(PORT, () => console.log("Server running on port ", PORT));

myServer.on("error", (err) => {
    console.log("Server Error", err);
});

// Getting Public folder
const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reading and showing messages (if existing) function
const readFile = () => {
    let fileNames = fs.readdirSync("./");
    const fileFound = fileNames.find((element) => "chatFile.txt" === element);
    if (fileFound === "chatFile.txt") {
        const data = fs.readFileSync("./chatFile.txt", "utf-8");
        return data;
    } else {
        console.log("Cannot read the file");
    }
};

// Saving messages (array) in .JSON file
const saveMessages = (messages) => {
    fs.writeFileSync(
        "./chatFile.txt",
        JSON.stringify(messages, undefined, 2),
        "utf-8"
    );
};

// Saving messages in file
const saveNewMessage = (data) => {
    let messages = JSON.parse(readFile());
    let now = new Date();
    let date = moment(now).format("DD/MM/YYYY HH:MM:SS");
    const newMessage = { email: data.email, date: date, message: data.message };
    messages.push(newMessage);
    saveMessages(messages);
};


// Routers
// app.use("/api/products", productsApi);

// Routes

// Index
app.get("/", (req, res) => {
    res.sendFile(publicPath + "/indexPage.html", { products });
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
    res.status(201).sendFile(`${publicPath}/indexPage.html`, { products });
});

// Initializing WebSocket Server

const socketIoServer = io(myServer);

socketIoServer.on("connection", (socket) => {
    const chatFile = readFile();
    console.log("A new client is connected");

    // Product List
    socketIoServer.emit("Products", products);
    socketIoServer.emit("message", chatFile);

    // Chat
    socket.emit("chatMessage", (message) => {
        console.log(message);
    });

    // Listening to chatMessage
    socket.on("chatMessage", (chat) => {
        saveNewMessage(chat);
        const chatFile = readFile();

        // Sending chat to users
        socket.emit("message", chatFile);
        socket.broadcast.emit("message", chatFile);
    });
});