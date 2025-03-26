document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const typingIndicator = document.getElementById("typing-indicator");
    const cursorGlow = document.getElementById("cursor-glow");

    document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = `${e.clientX - 100}px`;
        cursorGlow.style.top = `${e.clientY - 100}px`;
    });
    
    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    async function sendMessage() {
        let message = userInput.value.trim();
        if (!message) return;

        appendMessage("user-message", message);
        userInput.value = "";

        // Show typing indicator
        typingIndicator.style.display = "block";

        try {
            let response = await fetch("http://127.0.0.1:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            let data = await response.json();

            // Hide typing indicator and show response
            typingIndicator.style.display = "none";
            appendMessage("bot-message", data.message);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function appendMessage(className, text) {
        let msgDiv = document.createElement("div");
        msgDiv.className = className;
        msgDiv.innerText = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Dark Mode Toggle
    document.querySelector(".toggle-dark-mode").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});
