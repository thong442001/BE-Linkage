const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const message = new Schema({
    ID_group: {
        type: ObjectId,
        ref: 'group',
    },
    sender: {
        type: ObjectId,
        ref: 'user',
    },
    content: {
        type: String, // kiểu dữ liệu
        required: true,
    },
    type: {
        type: String, // kiểu dữ liệu
        enum: ['text', 'image', 'video'],
        required: "text",
    },
    ID_message_reply: {
        type: ObjectId,
        ref: 'message',
        default: null,
    },
    createdAt: {
        type: Date, // kiểu dữ liệu
        default: Date.now()
    },
    _destroy: {
        type: Boolean, // kiểu dữ liệu
        default: false
    },
});
module.exports = mongoose.models.message || mongoose.model('message', message);
