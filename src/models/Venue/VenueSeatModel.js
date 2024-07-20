const { DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/config");
const { v4: uuidv4 } = require("uuid");

const VenueSeatModel = sequelize.define("venueseatmodel", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
    },
    venueLayoutId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // [row , column]
    coordinates: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    },
});

module.exports = VenueSeatModel;
