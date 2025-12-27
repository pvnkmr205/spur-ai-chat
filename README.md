Spur – AI Live Chat Support Agent (Take-Home)

This project is a mini AI-powered customer support chat system, built as part of Spur’s Founding Full-Stack Engineer take-home assignment.
It simulates a live chat widget where users can interact with an AI support agent, with conversations persisted and contextually handled using an LLM.

🚀 Live Demo

Frontend: https://spur-ai-chat-a8ez.vercel.app
Backend API: https://spur-ai-chat.onrender.com

🛠 Tech Stack

Frontend
Svelte (Vite)
TypeScript
CSS animations for chat UX

Backend
Node.js + TypeScript
Express
SQLite (sqlite3)
Groq LLM API (LLaMA-3.1-8B-Instant)

✨ Features

Live chat UI with:
Message bubbles
User vs AI distinction
Auto-scroll
Typing indicator animation
Persistent conversations using session IDs
Conversation history included in LLM prompts
Domain-specific FAQ grounding:
Shipping policy
Return & refund policy
Support hours
Graceful error handling for:
Empty input
LLM failures

🧩 Architecture Overview
Frontend (Svelte)
   ↓
POST /chat/message
   ↓
Express Route
   ↓
Chat Service
   ├─ Persist user message
   ├─ Fetch conversation history
   ├─ Generate AI reply (LLM service)
   └─ Persist AI reply
   
Backend Structure
routes/ – API endpoints
services/
chat.service.ts – conversation & message logic
llm.service.ts – LLM abstraction (Groq)
db/
SQLite setup & schema
Clear separation of concerns for extensibility (future WhatsApp / IG channels)

🤖 LLM Integration

Provider: Groq
Model: llama-3.1-8b-instant
Prompting Strategy:
System prompt defines AI as a helpful e-commerce support agent
Hard-coded FAQ context included
Recent conversation history injected for continuity
Token usage kept minimal for cost control

⚙️ Running Locally

Backend
cd backend
npm install
Create .env:
GROQ_API_KEY=your_key_here
npm run dev

Frontend
cd frontend
npm install
npm run dev

🧪 API Example

POST /chat/message
{
  "message": "What is your return policy?"
}


Response:

{
  "reply": "We offer a 7-day return policy...",
  "sessionId": "uuid"
}

🧠 Design Decisions

Chose SQLite for simplicity and reliability in a take-home scop
Abstracted LLM logic to allow easy provider switching
Used async DB patterns to ensure production safety
Prioritized robustness and clarity over unnecessary features

🚧 If I Had More Time…

Add streaming responses for real-time typing
Introduce Redis for session caching
Build an admin dashboard to view conversations
Add tool-calling for order lookup / refunds

🙌 Final Notes

This project mirrors the core workflow of a real customer engagement system and is designed with extensibility, robustness, and developer clarity in mind.
