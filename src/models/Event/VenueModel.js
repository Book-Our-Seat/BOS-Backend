const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/sequelizeConfig");
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
        allowNull: true,
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
    //TODO: this should contain layoutid -> pointing to a layout.
});


module.exports = VenueModel;
