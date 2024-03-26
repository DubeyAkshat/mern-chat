import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getMessages } from '../controllers/message.controller.js';
import { sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/:userToChatId", protectRoute, getMessages)
router.post("/send/:receiverUserId", protectRoute, sendMessage)

export default router
