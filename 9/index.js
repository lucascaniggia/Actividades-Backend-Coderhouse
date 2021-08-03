import express from "express";
import multer from "multer";
import productsApi from "./routes/productsApi";

// Server Initializing

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => console.log("Server running on port ", PORT));

server.on("error", (err) => {
    console.log("Server Error", err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routers
app.use("/api/products", productsApi);

// Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

//Storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.filename + "-" + Date.now());
    },
});

var upload = multer({ storage: storage });