const group = require("../models/group");

module.exports = {
    findGroupPrivate,
    addGroupPrivate,
    getGroupID,
    findID_userGroupPrivate,
    getAllGroupOfUser,
}

async function addGroupPrivate(user1, user2) {
    try {
        const members = [user1, user2]
        const newItem = {
            members,
        };
        const newGroupPrivate = await group.create(newItem);
        //console.log(newGroup);
        return newGroupPrivate;
    } catch (error) {
        console.log(error);
        return false;
    }
}
async function getGroupID(ID_group) {
    try {
        const result = await group.findById(ID_group).populate({
            path: 'members',
            select: 'displayName avatar' // Chỉ lấy trường name và email (_id auto lấy)
        });
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function findID_userGroupPrivate(group, ID_me) {
    try {
        if (group.isPrivate = true) {
            group?.members.map((user) => {
                if (user != ID_me) {
                    return user
                }
            })
        }
        return false;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function findGroupPrivate(user1, user2) {
    try {
        // Tìm nhóm riêng chứa cả 2 user
        const result = await group.findOne({
            members: { $all: [user1, user2] },
            isPrivate: true
        });
        // null là ko tìm thấy
        if (result != null) {
            return result._id;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function getAllGroupOfUser(ID_user) {
    try {
        const groups = await group.find({ members: ID_user })
            .populate('members', 'displayName avatar')
            .exec();
        return groups;
    } catch (error) {
        console.log(error);
        throw error;
    }
}