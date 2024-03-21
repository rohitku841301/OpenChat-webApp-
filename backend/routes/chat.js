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
router.patch("/showGroup/group-info/promote-to-admin", user.authentication, chatController.promoteToAdmin);
router.delete("/showGroup/group-info/removeMember/:userId", user.authentication, chatController.removeMember);
router.delete("/showGroup/exit-group/:userId", user.authentication, chatController.exitGroup);
router.get("/checkYouAreAdmin/:groupId", user.authentication, chatController.checkYouAreAdmin);

module.exports = router;