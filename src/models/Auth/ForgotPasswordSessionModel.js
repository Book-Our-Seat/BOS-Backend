const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../../config/config");
const { v4: uuidv4 } = require("uuid");

//TODO: use session instead!
/**
 * @deprecated 
 */
const ForgotPasswordSessionModel = sequelize.define("forgotpasswordsession", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
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
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = ForgotPasswordSessionModel;
