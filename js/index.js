document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("send-message")
    .addEventListener("click", enviarMensajeAlServidor);

  document
    .getElementById("user-message")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        enviarMensajeAlServidor();
      }
    });

  function scrollChatToBottom() {
    var chatMessages = document.getElementById("contenedor_chat");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function enviarMensajeAlServidor() {
    var message = document.getElementById("user-message").value;
    if (message) {
      // Enviar mensaje al backend
      document.getElementById("user-message").value = "";
      mensajeSistema("Procesando tu solicitud", "info");
      scrollChatToBottom();
      sendMessageToBackend(message);
    }
  }

  async function sendMessageToBackend(message) {
    const url = "https://spectrelw.pythonanywhere.com/bot"; 
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_message: message }),
      });

      if (!response.ok) {
        mensajeSistema("Hay un problema en el servidor..", "danger");
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      displayResponse(message, responseData.response);
    } catch (error) {
      console.error("Error:", error.message);
      // Mostrar mensaje de error al usuario
      displayResponse(
        message,
        "Error en el servidor. Por favor, inténtalo de nuevo más tarde."
      );
      mensajeSistema("Chatbot fuera de servicio..", "danger");
    }
  }

  // Función para mostrar el mensaje del usuario
  function mostrarMensajeUsuario(chatuser) {
    var chatMessages = document.getElementById("chat-messages");
    var userMessageElement = document.createElement("div");
    userMessageElement.classList.add("alert", "alert-success");
    userMessageElement.setAttribute("role", "alert");
    userMessageElement.textContent = chatuser;
    chatMessages.appendChild(userMessageElement);
  }

  // Función para mostrar la respuesta del sistema
  function mostrarRespuestaDeSistema(response) {
    var chatMessages = document.getElementById("chat-messages");
    var newMessage = document.createElement("div");
    newMessage.classList.add("alert", "alert-primary");
    newMessage.setAttribute("role", "alert");

    // Verificar si response es undefined o null antes de realizar el split
    if (response !== undefined && response !== null) {
      var responseLines = response.split("\n");
      responseLines.forEach(function (line) {
        var lineElement = document.createElement("div");
        lineElement.textContent = line;
        newMessage.appendChild(lineElement);
      });
    } else {
      // Si response es undefined o null, mostrar un mensaje de error o realizar otra acción necesaria
      console.error("La respuesta del sistema es indefinida o nula");
    }

    chatMessages.appendChild(newMessage);
    mensajeSistema("Esperando su solicitud", "success");
  }

  async function displayResponse(userMessage, botMessage) {
    mostrarMensajeUsuario(userMessage);
    mostrarRespuestaDeSistema(botMessage);
    scrollChatToBottom();
  }

  function mensajeSistema(mensaje, tipo) {
    var progressBar = document.getElementById("mensajes-sistema-constenido");
    progressBar.textContent = mensaje;

    // Limpiar clases de fondo y texto
    progressBar.classList.remove(
      "bg-primary",
      "bg-danger",
      "bg-secondary",
      "bg-success",
      "bg-info",
      "bg-warning",
      "text-dark"
    );

    // Establecer clase de fondo y texto según el tipo
    switch (tipo) {
      case "primary":
        progressBar.classList.add("bg-primary");
        break;
      case "danger":
        progressBar.classList.add("bg-danger");
        break;
      case "secondary":
        progressBar.classList.add("bg-secondary");
        break;
      case "success":
        progressBar.classList.add("bg-success");
        break;
      case "info":
        progressBar.classList.add("bg-info", "text-dark");
        break;
      case "warning":
        progressBar.classList.add("bg-warning", "text-dark");
        break;
      default:
        // Si el tipo no coincide con ninguno de los valores esperados, se usará el color por defecto
        progressBar.classList.add("bg-primary");
        break;
    }
  }

  console.log("Todos los elementos del DOM han sido cargados.");
  mensajeSistema("Esperando su solicitud", "success");
});
