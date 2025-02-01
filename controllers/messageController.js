const message = require("../models/message");

module.exports = {
    addMessage,
    getMessagesGroup,
}

async function addMessage(ID_group, sender, content, type, ID_message_reply) {
    try {
        const newItem = {
            ID_group,
            sender,
            content,
            type,
            ID_message_reply,
        };
        const newMess = await message.create(newItem);
        //console.log(newMess);
        return newMess;
    } catch (error) {
        console.log(error);
        return false;
    }
}
async function getMessagesGroup(ID_group) {
    try {
        const messages = await message.find({ ID_group: ID_group })
            .populate('sender', 'displayName avatar')
            .populate("ID_message_reply", "content") // Lấy đầy đủ thông tin của tin nhắn trả lời
            .sort({ createdAt: 1 });
        return messages;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
