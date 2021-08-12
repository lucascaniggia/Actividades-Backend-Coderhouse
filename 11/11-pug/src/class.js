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
    constructor(title, price, id) {
        this.id = id;
        this.title = title;
        this.price = price;
    }

    read(array) {
        return array;
    }

    write(array) {
        products.push({
            id: products.length + 1,
            title: array.title,
            price: array.price,
        });
    }

    delete(id) {
        products.splice(id - 1, 1);
    }
}