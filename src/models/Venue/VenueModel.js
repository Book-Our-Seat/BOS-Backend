const { DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/config");
const { v4: uuidv4 } = require("uuid");

const VenueModel = sequelize.define("venuemodel", {
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
    addressLine1: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});


module.exports = VenueModel;
