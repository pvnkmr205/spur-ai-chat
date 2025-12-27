<script lang="ts">
  import { onMount } from "svelte";
  import { sendMessage } from "../lib/api";

  type ChatMessage = {
    sender: "user" | "ai";
    text: string;
  };

  let messages: ChatMessage[] = [];
  let input = "";
  let loading = false;
  let sessionId: string | null = null;

  onMount(() => {
    sessionId = localStorage.getItem("sessionId");
  });

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userText = input;
    input = "";
    messages = [...messages, { sender: "user", text: userText }];
    loading = true;

    try {
      const res = await sendMessage(userText, sessionId || undefined);
      sessionId = res.sessionId;
      localStorage.setItem("sessionId", sessionId);
      messages = [...messages, { sender: "ai", text: res.reply }];
    } catch {
      messages = [
        ...messages,
        { sender: "ai", text: "Something went wrong. Please try again." }
      ];
    } finally {
      loading = false;
    }
  }
</script>

<style>
  body {
    background: #0b1220;
  }

  .chat-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .chat {
    width: 100%;
    max-width: 420px;
    height: 80vh;
    background: #020617;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    padding: 16px;
    background: #020617;
    border-bottom: 1px solid #1e293b;
    font-weight: 600;
    color: #e5e7eb;
  }

  .messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .bubble {
    max-width: 75%;
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
  }

  .user {
    align-self: flex-end;
    background: #2563eb;
    color: white;
    border-bottom-right-radius: 4px;
  }

  .ai {
    align-self: flex-start;
    background: #111827;
    color: #e5e7eb;
    border-bottom-left-radius: 4px;
  }

  .typing {
    font-style: italic;
    font-size: 13px;
    opacity: 0.7;
  }

  .input-area {
    display: flex;
    padding: 12px;
    border-top: 1px solid #1e293b;
    background: #020617;
    gap: 8px;
  }

  input {
    flex: 1;
    padding: 10px 12px;
    border-radius: 8px;
    border: none;
    outline: none;
    background: #020617;
    color: #e5e7eb;
    border: 1px solid #1e293b;
  }

  button {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    background: #2563eb;
    color: white;
    font-weight: 500;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
}

.typing {
  animation: pulse 1.2s infinite;
}
.user {
  animation: messageIn 0.18s ease-out;
}

.ai {
  animation: messageIn 0.22s ease-out;
}
</style>


<div class="chat-wrapper">
  <div class="chat">
    <div class="header">
      Spur Support
    </div>

    <div class="messages">
      {#each messages as msg}
        <div class="bubble {msg.sender}">
          {msg.text}
        </div>
      {/each}

      {#if loading}
        <div class="bubble ai typing">Agent is typing…</div>
      {/if}
    </div>

    <div class="input-area">
      <input
        placeholder="Type your message…"
        bind:value={input}
        on:keydown={(e) => e.key === "Enter" && handleSend()}
      />
      <button on:click={handleSend} disabled={loading}>
        Send
      </button>
    </div>
  </div>
</div>
