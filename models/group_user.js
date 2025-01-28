const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const group_user = new Schema({
    id: { type: ObjectId }, // khóa chính
    ID_group: {
        type: ObjectId,
        ref: 'group',
    },
    ID_user: {
        type: ObjectId,
        ref: 'user',
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
module.exports = mongoose.models.group_user || mongoose.model('group_user', group_user);
