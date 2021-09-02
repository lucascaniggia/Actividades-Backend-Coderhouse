import express from "express";
import path from "path";
import * as http from "http";
import io from "socket.io"
import { products } from "./class";
import moment from "moment";
import fs, { exists } from "fs";
import knex from "knex";

let now = new Date();
let date = moment(now).format("DD/MM/YYYY HH:MM:SS");

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

// Initializing SQLite3 DB
const sqLiteMDB = knex({
    client: "sqlite3",
    connection: { filename: "./mydbMess.sqlite" },
});

// Initializing MySQL DB
const sqlitePDB = knex({
    client: "sqlite3",
    connection: { filename: "./mydbProd.sqlite"}
    // connection: {
    //     host: "127.0.0.1",
    //     user: "root",
    //     password: "",
    //     database: "products",
    // },
    // pool: { min: 0, max: 7 },
});

// SQLite3 DB Creation
sqLiteMDB.schema.hasTable("messages").then((exists) => {
    if (!exists) {
        sqLiteMDB.schema
            .createTable("messages", (table) => {
                table.increments("id"),
                table.string("email"),
                table.string("message"),
                table.date("createdAt");
            })
            .then(() => {
                console.log("Tabla Creada");
            });
    } else {
        console.log("La tabla ya existe");
    }
});

// MySQL DB Creation
sqlitePDB.schema.hasTable("products").then((exists) => {
    if (!exists) {
        sqlitePDB.schema
            .createTable("products", (table) => {
                table.increments("id"),
                table.string("title").notNullable,
                table.integer("price").notNullable,
                table.string("thumbnail"),
                table.date("createdAt");
            })
        .then(() => {
            console.log("Tabla Creada");
        });
    } else {
        console.log("La tabla ya existe");
    }
});

class MessagesBD {
    async getAll() {
        const readMessage = await sqLiteMDB.from("messages").select();
        return readMessage;
    }
}

const myMessages = new MessagesBD();

class ProductsBD {
    async getAll() {
        const products = await sqlitePDB.from("products").select();
        return products;
    }
}
const myProducts = new ProductsBD();

// Inserting msgs in SQLite3
const messageTable = sqLiteMDB.from("messages");

// const testDBMsg = [
//     {
//         email: "otrocorreo@hotmail.com",
//         message: "Probando otro email",
//         createdAt: now,
//     },
// ];

// messageTable.insert(testDBMsg).then(() => {
//     console.log("Mensaje Insertado");
// });

// Insert products in MySQL DB
const productsTable = sqlitePDB.from("products");

// const testDBProduct = [
//     {
//         title: "Producto 4",
//         price: 150,
//         thumbnail: "xxxx",
//         createdAt: now,
//     },
// ];

// productsTable.insert(testDBProduct).then(() => {
//     console.log("Producto Insertado");
// });

// //Deleting all products - SQL
// productsTable.del().then(() => {
//     console.log("Productos Eliminados");
// });

// Deleting product by ID - SQL
// productsTable
//     .where({ id: 4 })
//     .del()
//     .then(() => {
//         console.log("Producto Eliminado");
//     });

// Routes

// // Index
// app.get("/", (req, res) => {
//     res.sendFile(publicPath + "/indexPage.html", { products });
// });

// // Saving products
// app.post("/save", (req,res) => {
//     const body = req.body;

//     if (body == undefined) {
//         return res.status(400).json({
//             error: 'Product not found',
//         });
//     }

//     const newProduct = {
//         id: products.length + 1,
//         title: body.title,
//         price: body.price,
//         thumbnail: body.thumbnail,
//     };

//     products.push(newProduct)
//     res.status(201).sendFile(`${publicPath}/indexPage.html`, { products });
// });

// Initializing WebSocket Server

const socketIoServer = io(myServer);

const chatFile = myMessages.getAll().then((data) => {
    console.log(data);
});

const DBproducts = myProducts.getAll().then((data) => {
    console.log(data);
})

socketIoServer.on("connection", (socket) => {
    console.log("A new client is connected");

    // Product List
    socketIoServer.emit("products", DBproducts);
    socketIoServer.emit("message", chatFile);

    // Chat
    socket.emit("chatMessage", (message) => {
        console.log(message);
    });

    // Listening to chatMessage
    socket.on("chatMessage", (chat) => {
        saveNewMessage(chat);

        // Sending chat to users
        socket.emit("message", chatFile);
        socket.broadcast.emit("message", chatFile);
    });
});