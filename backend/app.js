const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql2 = require("mysql2");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

const Chat = require("./models/chat");
const User = require("./models/user");
const chatRoute = require("./routes/chat")
const sequelize = require("./database/db");
const userRoute = require("./routes/user");
const Group = require("./models/group");
const UserGroup = require("./models/UserGroup");



const app = express();

app.use(morgan('combined'));
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false, //preventing Cross-Site Scripting (XSS) and data injection attacks
}));

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);



app.use("/user", userRoute);
app.use("/chat", chatRoute);



app.use((req,res,next)=>{
  console.log("urll",req.url);
  res.sendFile(path.join(__dirname, `../${req.url}`));
  // console.log(pathFile);
})


User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group, {through: "UserGroup", constraints: false});
Group.belongsToMany(User, {through: "UserGroup", constraints: false});

User.hasMany(UserGroup);
UserGroup.belongsTo(User);

Group.hasMany(UserGroup);
UserGroup.belongsTo(Group);

Group.hasMany(Chat);
Chat.belongsTo(Group);

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
