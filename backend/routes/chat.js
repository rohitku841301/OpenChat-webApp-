const express = require("express");
const router = express();
const user = require("../middlewear/auth")
const chatController = require("../controllers/chat")

router.get("/getChat", user.authentication, chatController.getChat);
router.post("/postChat", user.authentication, chatController.postChat);

module.exports = router;