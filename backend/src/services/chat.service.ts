import db from "../db";
import { v4 as uuidv4 } from "uuid";

export type Sender = "user" | "ai";

export interface Message {
  id: string;
  conversation_id: string;
  sender: Sender;
  text: string;
  created_at: string;
}

export function getOrCreateConversation(sessionId?: string): string {
  if (sessionId) {
    const existing = db
      .prepare("SELECT id FROM conversations WHERE id = ?")
      .get(sessionId);

    if (existing) return sessionId;
  }

  const newId = uuidv4();
  db.prepare("INSERT INTO conversations (id) VALUES (?)").run(newId);
  return newId;
}

export function saveMessage(
  conversationId: string,
  sender: Sender,
  text: string
) {
  db.prepare(
    `INSERT INTO messages (id, conversation_id, sender, text)
     VALUES (?, ?, ?, ?)`
  ).run(uuidv4(), conversationId, sender, text);
}

export function getConversationHistory(
  conversationId: string,
  limit = 10
): Message[] {
  return db
    .prepare(
      `SELECT * FROM messages
       WHERE conversation_id = ?
       ORDER BY created_at ASC
       LIMIT ?`
    )
    .all(conversationId, limit) as Message[];
}
