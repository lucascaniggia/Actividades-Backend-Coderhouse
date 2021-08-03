export let products = [
    { id: 1, title: "Product 1", price: 50 },
    { id: 2, title: "Product 2", price: 120 },
];

export class Product {
    constructor(title, price, id) {
        this.title = title;
        this.price = price;
        this.id = id;
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