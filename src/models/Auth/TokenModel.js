const { DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/config");


const TokenModel = sequelize.define("Token", {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = TokenModel;
