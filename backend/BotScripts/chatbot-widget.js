(function () {
  const settings = {
    // Customizare buton de chat
    chat_button_color: "#009688",
    chat_button_text: "?",
    chat_button_size: "30px",

    // Customizare container chatbot
    container_width: "300px",
    container_height: "400px",

    // Customizare header chatbot
    header_text: "Athena",
    header_background_color: "#009688",
    header_text_color: "#ffffff",
    header_font_size: "20px",
    header_text_align: "left",

    // Customizare body chatbot
    body_background_color: "#ffffff",
    body_text_color: "#000000",
    body_font_size: "16px",
    body_user_bubble_color: "#e0f2f1",
    body_bot_bubble_color: "#b2dfdb",

    // Customize send button
    input_placeholder: "Scrie un mesaj...",
    input_text_color: "black",
    input_font_size: "14px",

    // Customize send button
    send_button_color: "#009688",
    send_button_text: "Trimite",
    send_button_font_size: "12px",
    send_button_text_color: "white",
  };

  window.loadNewSettings = function (bot_id, secret_key) {};

  window.applyStyles = function (settings) {
    // Apply styles to the chat button
    chatButton.style.backgroundColor = settings.chat_button_color;
    chatButton.innerText = settings.chat_button_text;
    chatButton.style.width = settings.chat_button_size;
    chatButton.style.height = settings.chat_button_size;
    chatButton.style.fontSize = parseInt(settings.chat_button_size) / 2 + "px";

    // Apply styles to the chatbot container
    chatbotContainer.style.width = settings.container_width;
    chatbotContainer.style.height = settings.container_height;
    chatbotContainer.style.backgroundColor = settings.body_background_color;
    chatbotContainer.style.bottom =
      25 + parseInt(settings.chat_button_size) + "px";

    // Apply styles to the chatbot header
    chatbotHeader.innerText = settings.name;
    chatbotHeader.style.backgroundColor = settings.header_background_color;
    chatbotHeader.style.color = settings.header_text_color;
    chatbotHeader.style.fontSize = settings.header_font_size;
    chatbotHeader.style.textAlign = settings.header_text_align;

    // Apply styles to the chatbot body
    chatbotBody.style.backgroundColor = settings.body_background_color;
    chatbotBody.style.color = settings.body_text_color;
    chatbotBody.style.fontSize = settings.body_font_size;
    chatbotBody.style.body_bot_bubble_color = settings.body_bot_bubble_color;
    chatbotBody.style.body_user_bubble_color = settings.body_user_bubble_color;

    // Apply styles to the chatbot input
    chatbotInput.placeholder = settings.input_placeholder;
    chatbotInput.style.color = settings.input_text_color;
    chatbotInput.style.fontSize = settings.input_font_size;
    chatbotInput.style.backgroundColor = settings.body_background_color;

    // Apply styles to the chatbot send button
    chatbotButton.style.backgroundColor = settings.send_button_color;
    chatbotButton.innerText = settings.send_button_text;
    chatbotButton.style.fontSize = settings.send_button_font_size;
    chatbotButton.style.color = settings.send_button_text_color;

    for (let i = 0; i < chatbotBody.children.length; i++) {
      const message = chatbotBody.children[i].children[0];
      if (message.dataset.sender === "User") {
        message.style.backgroundColor = settings.body_user_bubble_color;
      } else {
        message.style.backgroundColor = settings.body_bot_bubble_color;
      }
    }
  };

  // Create the chat button
  var chatButton = document.createElement("button");
  chatButton.id = "chat-button";
  chatButton.style.position = "fixed";
  chatButton.style.bottom = "20px";
  chatButton.style.right = "20px";
  chatButton.style.width = "40px";
  chatButton.style.height = "40px";
  chatButton.style.borderRadius = "50%";
  chatButton.style.backgroundColor = "#009688";
  chatButton.style.color = "#fff";
  chatButton.style.border = "none";
  chatButton.style.cursor = "pointer";
  chatButton.style.zIndex = "1001";
  chatButton.style.fontSize = "12px";
  document.body.appendChild(chatButton);

  // Create the chatbot container
  var chatbotContainer = document.createElement("div");
  chatbotContainer.id = "chatbot-container";
  chatbotContainer.style.position = "fixed";
  chatbotContainer.style.bottom =
    25 + parseInt(settings.chat_button_size) + "px";
  chatbotContainer.style.right = "20px";
  chatbotContainer.style.width = "300px";
  chatbotContainer.style.height = "400px";
  chatbotContainer.style.border = "1px solid #ccc";
  chatbotContainer.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  chatbotContainer.style.display = "none";
  chatbotContainer.style.flexDirection = "column";
  chatbotContainer.style.zIndex = "1000";
  chatbotContainer.style.borderRadius = "10px";

  // Create the chatbot header
  var chatbotHeader = document.createElement("div");
  chatbotHeader.style.backgroundColor = "teal";
  chatbotHeader.style.color = "white";
  chatbotHeader.style.padding = "10px";
  chatbotHeader.style.cursor = "pointer";
  chatbotHeader.style.borderTopLeftRadius = "10px";
  chatbotHeader.style.borderTopRightRadius = "10px";
  chatbotHeader.innerText = "Athena";
  chatbotContainer.appendChild(chatbotHeader);

  // Create the chatbot body
  var chatbotBody = document.createElement("div");
  chatbotBody.style.flex = "1";
  chatbotBody.style.padding = "10px";
  chatbotBody.style.overflowY = "auto";
  chatbotBody.style.display = "block";
  chatbotContainer.appendChild(chatbotBody);

  // Create the chatbot input
  var chatbotInputContainer = document.createElement("div");
  chatbotInputContainer.style.display = "flex";
  chatbotInputContainer.style.padding = "10px";
  chatbotInputContainer.style.borderTop = "1px solid #ccc";
  chatbotInputContainer.style.alignItems = "center";

  // Create the chatbot input
  var chatbotInput = document.createElement("input");
  chatbotInput.type = "text";
  chatbotInput.placeholder = "Scrie un mesaj...";
  chatbotInput.style.flex = "1";
  chatbotInput.style.padding = "5px";
  chatbotInput.style.border = "1px solid #ccc";
  chatbotInput.style.borderRadius = "3px";
  chatbotInput.style.color = "black";
  chatbotInput.style.fontSize = "14px";

  // Create the chatbot send button
  var chatbotButton = document.createElement("button");
  chatbotButton.innerText = "Trimit";
  chatbotButton.style.marginLeft = "5px";
  chatbotButton.style.padding = "5px 10px";
  chatbotButton.style.border = "none";
  chatbotButton.style.backgroundColor = "#009688";
  chatbotButton.style.color = "#fff";
  chatbotButton.style.borderRadius = "3px";
  chatbotButton.style.cursor = "pointer";
  chatbotButton.style.fontSize = "12px"; // Dimensiunea textului

  chatbotInputContainer.appendChild(chatbotInput);
  chatbotInputContainer.appendChild(chatbotButton);
  chatbotContainer.appendChild(chatbotInputContainer);
  document.body.appendChild(chatbotContainer);

  var conversationId = null;
  let chatInitialized = false;

  // Check sessionStorage for chatbot visibility
  const isChatOpen = sessionStorage.getItem("chatOpen") === "true";
  if (isChatOpen) {
    chatbotContainer.style.display = "flex";
    if (!chatInitialized) {
      initializeConversation();
      chatInitialized = true;
    }
  }

  // Toggle chatbot visibility
  chatButton.addEventListener("click", function () {
    if (chatbotContainer.style.display === "none") {
      chatbotContainer.style.display = "flex";
      sessionStorage.setItem("chatOpen", "true");
      if (!chatInitialized) {
        initializeConversation();
        chatInitialized = true;
      }
    } else {
      chatbotContainer.style.display = "none";
      sessionStorage.setItem("chatOpen", "false");
    }
  });

  window.loadNewSettings = function (bot_id, secret_key) {
    fetch(
      "http://localhost:8000/api/chatbot_widget_design/?bot_id=" +
        bot_id +
        "&secret_key=" +
        secret_key
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Răspunsul nu este OK: " + response.status);
        }
        return response.text();
      })
      .then((text) => {
        try {
          const data = JSON.parse(text);
          Object.assign(settings, data);
          applyStyles(settings);
        } catch (e) {
          console.error("Eroare la parsarea JSON:", e);
        }
      })
      .catch((error) => {
        console.error("Eroare:", error);
      });
  };

  // Add a messages to the chatbot body
  function addMessage(sender, content) {
    var messageContainer = document.createElement("div");
    messageContainer.style.display = "flex";
    messageContainer.style.justifyContent =
      sender === "User" ? "flex-end" : "flex-start";

    var message = document.createElement("div");
    message.style.marginBottom = "10px";
    message.style.padding = "8px";
    message.style.borderRadius = "5px";
    message.style.wordWrap = "break-word";
    message.style.maxWidth = "80%";
    message.style.display = "inline-block";
    message.dataset.sender = sender;

    var contentSpan = document.createElement("span");
    contentSpan.innerHTML = content;

    message.appendChild(contentSpan);

    if (sender === "User") {
      message.style.backgroundColor = settings.body_user_bubble_color
        ? settings.body_user_bubble_color
        : "#e0f2f1";
    } else {
      message.style.backgroundColor = settings.body_bot_bubble_color
        ? settings.body_bot_bubble_color
        : "#b2dfdb";
    }

    messageContainer.appendChild(message);
    chatbotBody.appendChild(messageContainer);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function initializeConversation() {
    fetch("http://localhost:8000/api/chatbot/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        conversationId = data.conversation_id;
        addMessage("Athena", data.response);
      })
      .catch((error) => {
        console.error("Eroare la inițializarea conversației:", error);
        addMessage(
          "Athena",
          `A apărut o problemă la conectarea cu serverul.(${conversationId})`
        );
      });
  }

  // Send a message to the chatbot
  function sendMessage() {
    var message = chatbotInput.value.trim();
    if (message === "") return;

    addMessage("User", message);
    chatbotInput.value = "";

    fetch("http://localhost:8000/api/chatbot/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        conversation_id: conversationId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.response) {
          addMessage(settings.header_text, data.response);
        } else {
          addMessage(
            settings.header_text,
            `A apărut o eroare la generarea răspunsului.(${conversationId})`
          );
        }
      })
      .catch((error) => {
        console.error("Eroare:", error);
        addMessage(
          settings.header_text,
          `A apărut o eroare la trimiterea mesajului.(${conversationId})`
        );
      });
  }

  chatbotButton.addEventListener("click", sendMessage);

  chatbotInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
  window.applyStyles(settings);
})();
