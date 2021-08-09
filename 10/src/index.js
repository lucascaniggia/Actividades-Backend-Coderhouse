import express from "express";
import productsApi from "./routes/productsApi";
import path from 'path';
import handlebars from 'express-handlebars'

// Server Initializing
const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => console.log("Server running on port ", PORT));

server.on("error", (err) => {
    console.log("Server Error", err);
});

// Initializing Handlebars 
const layoutDirPath = path.resolve(__dirname, "../views/layouts");
const defaultLayerPath = path.resolve(__dirname, "../views/layouts/index.hbs");
const partialDirPath = path.resolve(__dirname, "../views/partials");
app.set("view engine", "hbs");
app.engine(
    "hbs",
    handlebars({
        layoutsDir: layoutDirPath,
        extname: "hbs",
        defaultLayout: defaultLayerPath,
        partialsDir: partialDirPath,
    })
);

// Initializing 'public' folder
const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.render("main");
});

//Routers
app.use("/api/products", productsApi);

// Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});