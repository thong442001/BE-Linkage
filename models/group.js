const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const group = new Schema({
    id: { type: ObjectId }, // khóa chính
    name: {
        type: String, // kiểu dữ liệu
    },
    avatar: {
        type: String, // kiểu dữ liệu
        default: "https://i.pinimg.com/564x/14/30/f2/1430f2a57ce798b01b075c3e88df5dc9.jpg",// avatar mặc định 
    },
    updatedAt: {
        type: Date, // kiểu dữ liệu
        default: Date.now()
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
module.exports = mongoose.models.group || mongoose.model('group', group);
