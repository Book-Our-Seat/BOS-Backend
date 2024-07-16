const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/config");
const { v4: uuidv4 } = require("uuid");


//TODO: use session instead!
/**
 * @deprecated 
 */
const SignupSessionModel = sequelize.define("signupsession", {
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
    otp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isValid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

module.exports = SignupSessionModel;
