const Sequelize = require("sequelize");

const sequelize = require("../database/db");

const UserGroup = sequelize.define("UserGroup",{
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
},{
    tableName: 'UserGroup', // Explicitly specify the table name
})

module.exports = UserGroup;