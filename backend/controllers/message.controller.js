import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { receiverUserId: receiverId } = req.params;
        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
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
