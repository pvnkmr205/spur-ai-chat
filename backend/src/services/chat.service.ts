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

// ---------- DB Helpers ----------

function dbGet<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row as T);
    });
  });
}

function dbAll<T>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows as T[]);
    });
  });
}

function dbRun(sql: string, params: any[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// ---------- Services ----------

export async function getOrCreateConversation(
  sessionId?: string
): Promise<string> {
  if (sessionId) {
    const existing = await dbGet<{ id: string }>(
      "SELECT id FROM conversations WHERE id = ?",
      [sessionId]
    );
    if (existing) return sessionId;
  }

  const newId = uuidv4();
  await dbRun("INSERT INTO conversations (id) VALUES (?)", [newId]);
  return newId;
}

export async function saveMessage(
  conversationId: string,
  sender: Sender,
  text: string
): Promise<void> {
  await dbRun(
    `INSERT INTO messages (id, conversation_id, sender, text)
     VALUES (?, ?, ?, ?)`,
    [uuidv4(), conversationId, sender, text]
  );
}

export async function getConversationHistory(
  conversationId: string,
  limit = 10
): Promise<Message[]> {
  return dbAll<Message>(
    `SELECT * FROM messages
     WHERE conversation_id = ?
     ORDER BY created_at ASC
     LIMIT ?`,
    [conversationId, limit]
  );
}
