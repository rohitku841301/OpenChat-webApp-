const Sequelize = require("sequelize");

const sequelize = require("../database/db");

const Chat = sequelize.define("chat",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
})

module.exports = Chat;