import Groq from "groq-sdk";
import type {
  ChatCompletionMessageParam
} from "groq-sdk/resources/chat/completions";
import { Message } from "./chat.service";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `
You are a helpful and professional customer support agent for a small e-commerce store.

Store information:
- Shipping: We ship worldwide. Orders ship within 2 business days.
- Returns: 30-day return window for unused items. Refunds are processed within 5 business days after inspection.
- Support hours: Monday to Friday, 9am–6pm IST.

Guidelines:
- Be clear, concise, and polite.
- Answer only based on the information provided.
- If unsure, say you will escalate to a human agent.
`;

export async function generateReply(
  history: Message[],
  userMessage: string
): Promise<string> {
  try {
    const messages: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: SYSTEM_PROMPT
  },
  ...history.map(
    (m): ChatCompletionMessageParam => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    })
  ),
  {
    role: "user",
    content: userMessage
  }
];

    const response = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages,
  temperature: 0.3,
  max_tokens: 150
});

    return (
      response.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response."
    );
  } catch (error) {
  console.error("Groq LLM error:", error);
  return "Sorry, I'm having trouble right now. Please try again shortly.";
}

}
