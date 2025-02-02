const message = require("../models/message");

module.exports = {
    addMessage,
    getMessagesGroup,
    set_destroyTrue,
}

async function addMessage(ID_group, sender, content, type, ID_message_reply) {
    try {
        const newItem = {
            ID_group,
            sender,
            content,
            type,
            ID_message_reply,
            createdAt: Date.now(),
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

async function set_destroyTrue(ID_message) {
    try {
        const messageEdit = await message.findById(ID_message)
        if (messageEdit) {
            // thu hồi
            messageEdit._destroy = true;
            await messageEdit.save();
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        throw error;
    }
}