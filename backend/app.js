const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql2 = require("mysql2");

const chatRoute = require("./routes/chat")
const sequelize = require("./database/db");
const userRoute = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/user", userRoute);
app.use("/chat", chatRoute);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server has started on port 3000");
    });
  })    
  .catch((error) => {
    console.log(error);
  });
