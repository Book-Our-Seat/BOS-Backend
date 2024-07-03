const { DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/sequelizeConfig");
const { v4: uuidv4 } = require("uuid");

const OtpSessionModel = sequelize.define("otpsessionmodel", {
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
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    emailOtp: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    phoneOtp: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isValid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

module.exports = OtpSessionModel;
