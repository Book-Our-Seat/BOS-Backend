const { DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/config");
const { v4: uuidv4 } = require("uuid");
const { ShowSeatStatus } = require("../../utils/enums");

const ShowSeatModel = sequelize.define("showseatmodel", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
    },
    seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinates: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(Object.values(ShowSeatStatus)),
        defaultValue: ShowSeatStatus.AVAILABLE,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bookingId: {
        type: DataTypes.UUID,
    },
    showId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});

module.exports = ShowSeatModel;
