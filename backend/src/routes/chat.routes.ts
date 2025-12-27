import { Router } from "express";
import {
  getOrCreateConversation,
  saveMessage,
  getConversationHistory
} from "../services/chat.service";
import { generateReply } from "../services/llm.service";

const router = Router();

router.post("/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message cannot be empty"
      });
    }

    const conversationId = await getOrCreateConversation(sessionId);

    saveMessage(conversationId, "user", message);

    const history = await getConversationHistory(conversationId);

    const aiReply = await generateReply(history, message);

    await saveMessage(conversationId, "user", message);
    await saveMessage(conversationId, "ai", aiReply);

    return res.json({
      reply: aiReply,
      sessionId: conversationId
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
});

export default router;
