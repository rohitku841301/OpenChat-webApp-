const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.postSignup = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (!existingUser) {
      bcrypt.hash(req.body.password, 7, (err, hash) => {
        if (err) {
          res.status(500).json({
            responseMessage: "internal server problem",
          });
        } else {
          User.create({...req.body, password:hash});
          res.status(200).json({
            reponseMessage: "User created successfully",
            success: true,
          });
        }
      });
    } else {
      res.status(404).json({
        reponseMessage: "User not found",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
        responseMessage: "internal server problem",
      });
  }
};
