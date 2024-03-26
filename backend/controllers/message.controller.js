import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

export const getMessages = async (req, res) => {
    try {
        const { userToChatId } = req.params;
        const currentUser = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [currentUser, userToChatId] },
        }).populate("messages");    // Brings actual messages instead of references

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { receiverUserId: receiverId } = req.params;
        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            message: message,
        })
        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json( {error: "Internal Server Error"} );
    }
}
