const bcrypt = require("bcrypt");
const User = require("../models/user");
const genrateToken = require("../utils/token");

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
          User.create({ ...req.body, password: hash });
          res.status(200).json({
            responseMessage: "User created successfully",
            success: true,
          });
        }
      });
    } else {
      res.status(404).json({
        responseMessage: "Email already exist",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      responseMessage: "internal server problem",
    });
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      bcrypt.compare(
        req.body.password,
        existingUser.password,
        (err, result) => {
          console.log(result);
          if (err) {
            return res.status.json({
              responseMessage: "internal server problem",
            });
          } else {
            if (result) {
              const token = genrateToken(existingUser.id);
              return res.status(200).json({
                responseMessage: "login successful",
                token: token,
              });
            } else {
              return res.status(401).json({
                responseMessage: "password is incorrect",
                success: false,
              });
            }
          }
        }
      );
    } else {
      return res.status(404).json({
        responseMessage: "Email not found",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      responseMessage: "internal server problem",
    });
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const userId = req.user;
    const userData = await User.findByPk(userId);
    if(userData){
      const userDetails = {
        name:userData.name,
        email:userData.email,
        userId:userId
      }
      res.status(200).json({
        responseMessage:"successfully get user detail",
        userDetails:userDetails
      })
    }
  } catch (error) {
    return res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};
