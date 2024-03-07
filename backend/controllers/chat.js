const Chat = require("../models/chat");
const User = require("../models/user");

exports.getChat = async (req, res, next) => {
  try {
    console.log("got it");
    console.log(req.user);
    const allMessage = await Chat.findAll({
      order:[["createdAt", "ASC"]]
    });
    const result = allMessage.map((result)=>{
      return result;
    })
    res.status(200).json({
      responseMessage:"Get all message",
      result:result
    })
  } catch (error) {
    console.log(error);
  }
};

exports.postChat = async (req, res, next) => {
  try {
    console.log(req.user);
    const messageData = await Chat.create({
      message: req.body.message,
      userId:req.user
    });
    console.log(messageData);
    if (messageData) {
      res.status(200).json({
        responseMessage: "message delivered",
        message: messageData.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};
