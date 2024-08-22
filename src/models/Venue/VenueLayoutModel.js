const { DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/config");
const { v4: uuidv4 } = require("uuid");
const VenueSeatModel = require("./VenueSeatModel");
const VenueModel = require("./VenueModel");

const VenueLayoutModel = sequelize.define("venuelayoutmodel", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
    },
    venueId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rowCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    columnCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    /*
     * This is the grid representing the layout
     * 0 -> empty space, 1 -> seat.
     * The grid is serialized into a single string in a row major fashion.
     */
    layout: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    /*
     * Labels for each row, including empty rows.
     */
    rowLabels: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    columnLabels: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
});

VenueLayoutModel.hasMany(VenueSeatModel, {
    foreignKey: "venueLayoutId",
    as: "seats",
});

VenueSeatModel.belongsTo(VenueLayoutModel, {
    foreignKey: "venueLayoutId",
    as: "venueLayout",
});

VenueModel.hasOne(VenueLayoutModel, {
    as: "venueLayout",
    foreignKey: "venueId",
});

VenueLayoutModel.belongsTo(VenueModel, {
    foreignKey: "venueId",
    as: "venue",
});

module.exports = VenueLayoutModel;
