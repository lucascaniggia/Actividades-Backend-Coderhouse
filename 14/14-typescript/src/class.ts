export let products = [
    {
        id: 1,
        title: "Tomato",
        price: 100,
        thumbnail: "https://images.freeimages.com/images/large-previews/731/vegetable-1324803.jpg"
    },
    {
        id: 2,
        title: "Strawberry",
        price: 200,
        thumbnail: "https://images.freeimages.com/images/large-previews/812/vegetables-3-1330143.jpg",
    },
];

export class Product {
    title: String;
    price: Number;
    id: Number;
    thumbnail: String;
    constructor(title: String, price: Number, id: Number, thumbnail: String) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
    }

    read(array: String[]) {
        return array;
    }

    write(array:[id: Number,title: String,price: Number,thumbnail: String]) {
        products.push({
            id: products.length + 1,
            title: array.title,
            price: array.price,
            thumbnail: array.thumbnail,
        });
    }

    delete(id: Number) {
        products.splice(id - 1, 1);
    }
}