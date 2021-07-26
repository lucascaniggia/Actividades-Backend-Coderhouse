const fs = require("fs/promises");
const path = "./productos.txt";

let products = [];

class Product {
    constructor(id, title, price, thumbnail) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.thumbnail = thumbnail;
    }

    read() {
    //Reading File
    fs.readFile(path)
        .then((productsData) => {
        console.log(productsData.toString());
        return productsData;
        })
        .catch((err) => {
        console.log("[]");
        });
    }

    // Saving products
    async save(title, price, thumbnail) {
        try {
            let id = products.length + 1;
            products.push({ id, title, price, thumbnail });
            console.log(products);
            await fs.writeFile(path, JSON.stringify(products, null, 2));
            console.log("Product saved");
        } catch {
            (err) => {
            console.log("Writing or syntax error", err);
            };
        }
    }

    // Deleting files
    async delete() {
        await fs.unlink(path, (err, errOutput) => {
            if (err) console.log("File cannot be deleted", err);
            console.log("File deleted");
        });
    }
}

const newProduct = new Product();

newProduct.save("Item 1", "$20", "thumbnail1");
newProduct.save("Item 2", "$50", "thumbnail2");
newProduct.read();
newProduct.delete();