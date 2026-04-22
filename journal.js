let chat = document.getElementById("chat");
let msg = document.getElementById("msg");

// USER STORAGE
let user = localStorage.getItem("login") || "guest";
let chatKey = "chat_" + user;

let messages = JSON.parse(localStorage.getItem(chatKey)) || [];

// API
const API_KEY = "geminiapi";

async function getAIReply(text) {
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY
        },
        body: JSON.stringify({
          contents: [
            { parts: [{ text }] }
          ]
        })
      }
    );

    const data = await res.json();

    if (data.error) return data.error.message;

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply.";

  } catch {
    return "Network error.";
  }
}

// RENDER
function render() {
  chat.innerHTML = "";
  messages.forEach(m => {
    let div = document.createElement("div");
    div.className = "msg " + m.type;
    div.innerText = m.text;
    chat.appendChild(div);
  });
  chat.scrollTop = chat.scrollHeight;
}
render();

// SAVE
function save() {
  localStorage.setItem(chatKey, JSON.stringify(messages));
}

// SEND
function send() {
  let text = msg.value.trim();
  if (!text) return;

  messages.push({ type: "user", text });
  save();
  render();

  msg.value = "";

  messages.push({ type: "bot", text: "Thinking..." });
  render();

  setTimeout(async () => {

    let reply = await Promise.race([
      getAIReply(text),
      new Promise(r => setTimeout(() => r("AI timeout"), 100000))
    ]);

    messages.pop();
    messages.push({ type: "bot", text: reply });

    save();
    render();

  }, 500);
}