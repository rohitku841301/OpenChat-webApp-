require("dotenv").config();
const jwt = require("jsonwebtoken");

function genrateToken(id) {
  const token = jwt.sign(id, process.env.JWT_SECRET);
  return token;
};

module.exports = genrateToken;
