const Sequelize = require("sequelize");

const sequelize = require("../database/db");

const Group = sequelize.define("group",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isAdmin:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    }
})

module.exports = Group;