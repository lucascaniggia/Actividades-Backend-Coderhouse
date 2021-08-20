const socket = io.connect("http://localhost:8080", { forceNew: true });
const myEmail = "lucascaniggia5@gmail.com";

socket.on("products", (products) => {
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

// Receiving chat messages from server
socket.on("message", (chat) => {
  let chatParse = JSON.parse(chat);
  console.log(chatParse);
  const html = chatParse
    .map((chatMessage) => {
      return `<div>
                  <div class="chatEmail">${chatMessage.email}</div>
                  <div class="chatMsg">${chatMessage.message}</div>
                  <div class="chatDate">${chatMessage.date}</div>
              </div>`;
    })
    .join(" ");
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