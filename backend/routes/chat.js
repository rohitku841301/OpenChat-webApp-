const express = require("express");
const router = express();
const user = require("../middlewear/auth")
const chatController = require("../controllers/chat")

router.get("/getChat", user.authentication, chatController.getChat);
router.post("/postChat/:groupId", user.authentication, chatController.postChat);
router.post("/createGroup", user.authentication, chatController.createGroup);
router.get("/showGroup", user.authentication, chatController.showGroup);

router.get("/showGroup/:groupId", user.authentication, chatController.getGroupChat);
router.post("/showGroup/addUserToGroup", user.authentication, chatController.addUserToGroup);
router.get("/showGroup/group-info/diff", user.authentication, chatController.groupInfo);

module.exports = router;