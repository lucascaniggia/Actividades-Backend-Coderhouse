const http = require('http');

const PORT = 8000;

const getData = () => {
    // Random number functions
    const random = (min,max) => { return Math.floor(Math.random() * (max - min) + min) };
    const randomFloat = function random(max, min) { return (Math.fround(Math.random() * (max - min) + min)).toFixed(2) };

    const object = JSON.stringify([
        { id: random(1, 10) },
        { title: `Product ${random(1, 10)}` },
        { price: `$ ${randomFloat(0.0, 9999.99)}` },
        { thumbnail: `Photo ${random(1, 10)}` }
    ]);

    return object
};

// Server 
const requestListener = (req,res) => {
    const data = getData();
    if (req.url === '/' || req.url === '/object') {
        res.writeHead(200);
        res.end(data);
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "The page can't be found" }));
    }
};

const server = http.createServer(requestListener);
server.listen(PORT, () => {
    console.log(`Server listening on http://${PORT}`)
});
