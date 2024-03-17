require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.authentication = async (req, res, next) => {
  try {
    console.log("1");
    const headerToken = req.headers.authorization;
    console.log("2", headerToken);
    if (!headerToken) {
      return res.status(401).json({
        responseMessage: "Token not provided",
        success: false,
      });
    }
    const decode = await jwt.verify(headerToken, process.env.JWT_SECRET);

    console.log(decode);
    req.user = decode; 
    next();
  } catch (error) {
    res.status(401).json({
      responseMessage: "Token verification failed",
      success: false,
    });
  }
};
