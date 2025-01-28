const users = require("../models/user");
const bcrypt = require('bcryptjs');
//token
const JWT = require('jsonwebtoken');
const config = require("../config");

const postController = require("../controllers/postController")

module.exports = {
    getAllUsers,//user
    getUser,
    getRoleUser,
    getUsersDisplayName,
    addUser,
    addAdmin,
    addManage,
    loginApp,
    loginWeb,
    editUser,
    deleteUser,
    checkUserId,//chung
    checkEmail,
    addPostUser,//post
    deletePostUser,
    getNameAndAvatar,
    getFriendsInUser,//friendNotification
    addFriendNotificationInUser,
    deleteFriendNotificationInUser,
    addFriendInUser,//friens
}

async function getAllUsers() {
    try {
        const result = await users.find();
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
async function getUser(userId) {
    try {
        const result = await users.findById(userId);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
// search 
async function getRoleUser() {
    try {
        const list = await users.find({ "role": 3 }, " _id displayName avatar");
        return list;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getUsersDisplayName(displayName) {
    try {
        //search displayName của các users ( trừ admin)
        const list = await users.find({ "displayName": displayName, "role": 3 }, " _id displayName avatar");
        return list;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function addUser(email, password, displayName) {
    try {

        var hashPass = bcrypt.hashSync(password, 10);
        const newItem = { email, password: hashPass, displayName, role: 3 };
        if (newItem) {
            await users.create(newItem);
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}
async function addAdmin(email, password, displayName) {
    try {
        var hashPass = bcrypt.hashSync(password, 10);
        const newItem = { email, password: hashPass, displayName, role: 1 };
        if (newItem) {
            await users.create(newItem);
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}
async function addManage(email, password, displayName) {
    try {
        var hashPass = bcrypt.hashSync(password, 10);
        const newItem = { email, password: hashPass, displayName, role: 2 };
        if (newItem) {
            await users.create(newItem);
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function loginApp(body) {
    try {
        const { email, password } = body;
        const check_username = await users.findOne({ "email": email });

        if (check_username) {
            const ssPassword = bcrypt.compareSync(password, check_username.password);
            if (ssPassword) {
                //check role
                if (check_username.role == 3) {
                    //token
                    const token = JWT.sign({ email: email, data: "data ne" }, config.SECRETKEY, { expiresIn: '60s' });
                    const refreshToken = JWT.sign({ email: email }, config.SECRETKEY, { expiresIn: '1d' })

                    //res.status(200).json({ "status": true, "user": check_username, token: token, refreshToken: refreshToken });
                    return { "status": 200, "user": check_username, token: token, refreshToken: refreshToken };
                } else {
                    return { "status": 403, "message": "Tạo khoản không phải user" };
                }
            } else {
                //res.status(401).json({ "status": false, "message": "sai mật khẩu" });
                return { "status": 402, "message": "sai mật khẩu" };
            }
        } else {
            //res.status(402).json({ "status": false, "message": "sai tài khoản " });
            return { "status": 401, "message": "sai tài khoản" };
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function loginWeb(body) {
    try {
        const { email, password } = body;
        const check_username = await users.findOne({ "email": email });

        if (check_username) {
            const ssPassword = bcrypt.compareSync(password, check_username.password);
            if (ssPassword) {
                //check role
                if (check_username.role == 1 || check_username.role == 2) {
                    //token
                    const token = JWT.sign({ email: email, data: "data ne" }, config.SECRETKEY, { expiresIn: '60s' });
                    const refreshToken = JWT.sign({ email: email }, config.SECRETKEY, { expiresIn: '1d' })

                    //res.status(200).json({ "status": true, "user": check_username, token: token, refreshToken: refreshToken });
                    return { "status": 200, "user": check_username, token: token, refreshToken: refreshToken };
                } else {
                    return { "status": 403, "message": "Tạo khoản không phải admin hoặc manage" };
                }
            } else {
                //res.status(401).json({ "status": false, "message": "sai mật khẩu" });
                return { "status": 402, "message": "sai mật khẩu" };
            }
        } else {
            //res.status(402).json({ "status": false, "message": "sai tài khoản " });
            return { "status": 401, "message": "sai tài khoản" };
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function deleteUser(body) {
    try {
        const { email } = body;
        const result = await users.findOneAndDelete({ "email": email });
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function editUser(body) {
    try {
        const { email, password, avatar, displayName } = body;
        const itemEdit = await users.findOne({ "email": email });
        var hashPass = bcrypt.hashSync(password, 10);
        if (itemEdit) {

            itemEdit.password = hashPass ? hashPass : itemEdit.password;
            itemEdit.avatar = avatar ? avatar : itemEdit.avatar;
            itemEdit.displayName = displayName ? displayName : itemEdit.displayName;
            // itemEdit.phoneNumber = phoneNumber ? phoneNumber : itemEdit.phoneNumber;
            // itemEdit.birthday = birthday ? birthday : itemEdit.birthday;
            await itemEdit.save();

            // chỉnh name và avatar của posts
            await postController.editNameAndAvatar(itemEdit._id, displayName, avatar);
            return itemEdit;
        }
        return false;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


// *********** chung *****************

async function checkUserId(userId) {
    try {
        const check_id = await users.findById(userId);
        if (check_id) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function checkEmail(email) {
    try {
        const check_email = await users.findOne({ "email": email });
        if (check_email) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function addPostUser(userId, postId) {
    try {
        const itemEdit = await users.findById(userId);
        if (itemEdit) {
            //add post new vào posts của user
            //const postsNew = await itemEdit.posts.push() 
            itemEdit.posts.push(postId)
            await itemEdit.save();
        }
        return itemEdit;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function addFriendNotificationInUser(to, friendNotificationId) {
    try {
        const itemEdit = await users.findById(to);
        if (itemEdit) {
            //add friendNotification new vào friendNotifications của user
            itemEdit.friendNotifications.push(friendNotificationId)
            await itemEdit.save();
        }
        return itemEdit;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function deletePostUser(userId, id) {
    try {
        const itemEdit = await users.findById(userId);
        if (itemEdit) {
            // xóa post trong user
            const postsNew = await itemEdit.posts.filter(post => post.toString() != id);
            itemEdit.posts = postsNew;
            await itemEdit.save();
            //console.log(postsNew);
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function deleteFriendNotificationInUser(userId, friendNotificationId) {
    try {
        const itemEdit = await users.findById(userId);
        if (itemEdit) {
            // xóa friendNotification trong user
            const friendNotificationsNew = await itemEdit.friendNotifications.filter(post => post.toString() != friendNotificationId);
            itemEdit.friendNotifications = friendNotificationsNew;
            await itemEdit.save();
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getNameAndAvatar(userId) {
    try {
        const check_id = await users.findById(userId);
        if (check_id) {
            return { "displayName": check_id.displayName, "avatar": check_id.avatar };
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getFriendsInUser(userId) {
    try {
        const friends = await users.findById(userId, " friends ");
        if (friends) {
            return friends.friends;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function addFriendInUser(userId, friendId) {
    try {
        const itemEdit = await users.findById(userId);
        if (itemEdit) {
            itemEdit.friends.push(friendId)
            await itemEdit.save();
        }
        return itemEdit;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// async function checkFriend(form, to,) {
//     try {
//         const check = await users.find({""});
//         if (check) {
//             return true;
//         }
//         return false;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }