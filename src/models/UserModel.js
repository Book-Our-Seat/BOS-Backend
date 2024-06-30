const { DataTypes } = require("@sequelize/core");
const sequelize = require("../../config/sequelizeConfig");
const { v4: uuidv4 } = require('uuid');

const UserModel = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
    },
});

module.exports = UserModel;
