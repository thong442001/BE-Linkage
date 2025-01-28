//var createError = require('http-errors');
const express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');
// CORS
var cors = require('cors')

//config mongoose
const mongoose = require("mongoose");
require("./models/user");
require("./models/post");
require("./models/friendNotification");

var indexRouter = require('./routes/index');
//mogo
var userRoute = require('./routes/userRoute');
var postRoute = require('./routes/postRoute');
var friendNotificationRoute = require('./routes/friendNotificationRoute');

var app = express();

// socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
//const io = new Server(server);
const io = new Server(server, {
    cors: {
        origin: '*', // Cho phép bất kỳ nguồn nào hoặc chỉ định URL của ứng dụng React Native của bạn
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    },
    transports: ['polling'], // Đảm bảo sử dụng polling như phương án thay thế
});

// CORS
//app.use(cors())
app.use(cors({
    origin: '*', // Hoặc chỉ định nguồn cụ thể: ['http://localhost:19006', 'https://your-client-url']
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
//app.use(logger('dev'));
app.use(express.json());
// Middleware để phân tích dữ liệu từ form
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-config.js');
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// CDN CSS
const CSS_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { customCssUrl: CSS_URL })
);

//connect database
mongoose.connect('mongodb+srv://thong442001:F3WK9R2BOb3cV86h@totnghiep.8wwlj.mongodb.net/totNghiep')//link connect vs mongobd
    .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
    .catch(err => console.log('>>>>>>>>> DB Error: ', err));

app.use('/', indexRouter);
//mogo
app.use('/user', userRoute);
app.use('/post', postRoute);
app.use('/friendNotification', friendNotificationRoute);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });
// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// socket.io
// app.listen(3000, () => console.log("Server ready on port 3000."));
app.get('/', (req, res) => {
    res.send('Socket.io server is running!');
});

// Lắng nghe kết nối từ client
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Nhận tin nhắn từ client
    socket.on('send_message', (data) => {
        console.log('Message received: ', data);

        // Phát lại tin nhắn cho tất cả các client
        io.emit('receive_message', data);
    });

    // Ngắt kết nối
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Khởi động server
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;