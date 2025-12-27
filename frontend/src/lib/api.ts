const API_BASE = "https://spur-ai-chat.onrender.com";

export async function sendMessage(message: string, sessionId?: string) {
  const res = await fetch(`${API_BASE}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, sessionId })
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}
