var socket = io.connect("http://localhost:8080", { forceNew: true });

socket.on("messages", (products) => {
  const html = products
    .map((product) => {
      console.log(product.thumbnail  );
      return `<div>
                  <strong><h3>${product.title}</h3></strong>
                  <h4>$ ${product.price}</h4>
                  <img class="productImage" src=${product.thumbnail} width=60 height=60>
              </div>`;
    })
    .join(" ");

  document.getElementById("list").innerHTML = html;
});