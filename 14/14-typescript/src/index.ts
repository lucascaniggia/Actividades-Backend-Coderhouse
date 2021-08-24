import express from "express";
import path from "path";
import * as http from "http";
import * as socketio from 'socket.io';
import { products } from "./class";
import fs from "fs";
import moment from "moment";
import { Interface } from "node:readline";

// Server Initializing
const app = express();
const PORT = 8080;
const myServer = new http.Server(app);
myServer.listen(PORT, () => console.log("Server running on port ", PORT));

// myServer.on("error", (err) => {
//     console.log("Server Error", err);
// });

// Getting Public folder
const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reading and returning messages, if existing.
interface Data{
    data: Object
}

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
const saveMessages = (messages: String) => {
    fs.writeFileSync(
        "./chatFile.txt",
        JSON.stringify(messages, undefined, 2),
        "utf-8"
    );
};

// Saving messages in file
const saveNewMessage = (data: Object) => {
    let messages = JSON.parse(readFile());
    let now = new Date();
    let date = moment(now).format("DD/MM/YYYY HH:MM:SS");
    const newMessage = { email: data.email, date: date, message: data.message };
    messages.push(newMessage);
    saveMessages(messages);
};

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
    res.status(201).sendFile(`${publicPath}/index.html`, { products });
});

// Initializing WebSocket Server

export const socketIoServer: socketio.Server = new socketio.Server();
socketIoServer.attach(myServer);

socketIoServer.on('connection', async (socket: socketio.Socket) => {
    console.log('A new client is connected');
    const chatFile = readFile();
    // console.log("A new client is connected");
    
    // Product List
    socketIoServer.emit("Products", products);
    socketIoServer.emit("message", chatFile);
    
    // Chat
        socketIoServer.emit("chatMessage", (chat: String[]) => {
    saveNewMessage(chat);
        const chatFile = readFile();
        // Sending chat to users
        socketIoServer.emit("message", chatFile);
        socketIoServer.broadcast.emit("message", chatFile);
    });
});

