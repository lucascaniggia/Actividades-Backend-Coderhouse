const socket = io.connect("http://localhost:8080", { forceNew: true });

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

socket.on("message", (chat) => {
  console.log(chat);
  const html = `<div>
                  <strong><h4>${chat.email}</h4></strong>
                  <h5>${chat.chatMessage}</h5>
            </div>`;

  document.getElementById("chat").innerHTML = html;
});

//Message from Chat - indexPage.html
const chatForm = document.getElementById("chatForm");
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let chat = {
    email: e.target.elements.email.value,
    chatMessage: e.target.elements.msg.value,
  };

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", chat);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.email.value = "";
  e.target.elements.msg.focus();
});