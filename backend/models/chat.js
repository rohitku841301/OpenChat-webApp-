const Sequelize = require("sequelize");

const sequelize = require("../database/db");

const Chat = sequelize.define("chat",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    contentType: {
        type: Sequelize.ENUM('text', 'image'),
        allowNull: false
    },
    content: {
        type: Sequelize.STRING, // or DataTypes.TEXT if content may be longer
        allowNull: false
    }
})

module.exports = Chat;