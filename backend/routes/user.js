const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const user = require("../middlewear/auth");

router.post("/signup", userController.postSignup);
router.post("/login", userController.postLogin);
router.get("/userDetails", user.authentication, userController.getUserDetails)

module.exports = router;
