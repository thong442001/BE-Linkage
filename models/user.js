const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const user = new Schema({
    id: { type: ObjectId }, // khóa chính
    email: {
        type: String, // kiểu dữ liệu
        required: true, // bắt buộc phải có
        unique: true, // không được trùng
    },
    password: {
        type: String, // kiểu dữ liệu
        required: true, // bắt buộc phải có
    },
    displayName: {
        type: String, // kiểu dữ liệu
        required: true, // bắt buộc phải có
    },
    avatar: {
        type: String, // kiểu dữ liệu
        default: "https://i.pinimg.com/564x/14/30/f2/1430f2a57ce798b01b075c3e88df5dc9.jpg",// avatar mặc định 
    },
    status: {
        type: Number, // kiểu dữ liệu
        default: 1,
        // 0 bị khoá
        // 1 mặc định
        // 2 riêng tư
    },
    role: {
        type: Number, // kiểu dữ liệu
        // 0: user bi khoa
        // 1: admin 
        // 2: user
    },
    createdAt: {
        type: Date, // kiểu dữ liệu
        default: Date.now()
    },
});
module.exports = mongoose.models.user || mongoose.model('user', user);
