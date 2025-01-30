const { Server } = require("socket.io");
const message = require("./models/message");
const user = require("./models/user");

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: '*', // Cho phép bất kỳ nguồn nào hoặc chỉ định URL của ứng dụng React Native của bạn
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
        },
        transports: ['websocket', 'polling'],
        // Thêm 'websocket' để tối ưu kết nối
        // Đảm bảo sử dụng polling như phương án thay thế
    });

    // Lắng nghe kết nối từ client
    io.on('connection', (socket) => {
        // console.log(`User connected: ${socket.id}`);

        // socket.on("joinGroup", (groupId) => {
        //     socket.join(groupId);
        //     console.log(`User joined group: ${groupId}`);
        // });

        // // Nhận tin nhắn từ client
        // socket.on('send_message', (data) => {
        //     console.log('Message received: ', data);

        //     // Phát lại tin nhắn cho tất cả các client
        //     io.emit('receive_message', data);
        // });
        console.log(`✅ User connected: ${socket.id}`);

        socket.on("joinGroup", (ID_group) => {
            if (!ID_group) {
                console.error("❌ Group ID is missing!");
                return;
            }
            socket.join(ID_group);
            console.log(`👥 User ${socket.id} joined group: ${ID_group}`);
        });

        socket.on('send_message', async (data) => {
            const { ID_group, sender, content, type, ID_message_reply } = data;
            // Tìm thông tin người gửi từ database
            const checkUser = await user.findById(sender);
            if (checkUser == null) {
                console.log('Không tìm thấy user!');
                return;
            }
            // Lưu tin nhắn vào database
            const newMessage = new message({
                ID_group,
                sender,
                content,
                type,
                ID_message_reply
            });
            await newMessage.save();

            // Phát lại tin nhắn cho tất cả các client
            const newMessageSocket = {
                _id: newMessage._id,// tạo newMessage trc mới có _id
                ID_group,
                sender,
                content,
                type,
                ID_message_reply,
                displayName: checkUser.displayName,  // Thêm tên hiển thị
                avatar: checkUser.avatar,            // Thêm avatar
                createdAt: newMessage.createdAt,// tạo newMessage trc mới có createdAt
            };
            io.to(newMessageSocket.ID_group).emit('receive_message', newMessageSocket);
        });

        // Ngắt kết nối
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });

        socket.on('connect_error', (err) => {
            console.error('❌ Socket connection error:', err.message);
        });
    });

    return io;
}

module.exports = setupSocket;