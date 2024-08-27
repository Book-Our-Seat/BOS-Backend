const { DataTypes } = require("@sequelize/core");
const sequelize = require("../../config/config");
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
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
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
    role: {
        type: DataTypes.ENUM(['admin', 'user']), //TODO: Add a command to create admin user in db.
        defaultValue: 'user'
    },
    approvalStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    coins:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = UserModel;
