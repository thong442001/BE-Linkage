var express = require('express');
var router = express.Router();

const messageController = require("../controllers/messageController")

//checkToken
const checkToken = require("./checkToken");

//add  
//http://localhost:3000/message/addMessage
router.post('/addMessage', checkToken, async function (req, res, next) {
  try {
    const { ID_group, sender, content, type, ID_message_reply } = req.body;
    const result = await messageController.addMessage(ID_group, sender, content, type, ID_message_reply);
    if (result != null) {
      res.status(200).json({ "status": true, "message": "tạo mess thành công" });
    } else {
      res.status(401).json({ "status": false, "message": "Lỗi khi tạo mess" });
    }
  } catch (e) {
    return res.status(400).json({ "status": false, "message": "lỗi" });
  }
});

// http://localhost:3000/message/getMessagesGroup
router.get('/getMessagesGroup', checkToken, async function (req, res, next) {
  try {
    const { ID_group } = req.query;
    const messages = await messageController.getMessagesGroup(ID_group);
    if (messages != null) {
      res.status(200).json({ "status": true, "messages": messages });
    } else {
      res.status(201).json({ "status": true, "messages": null });
    }
  } catch (e) {
    res.status(400).json({ "status": false, "message": "lỗi API" });
  }
});



module.exports = router;
