const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/config");
const { v4: uuidv4 } = require("uuid");
const EventModel = require("./EventModel");
const VenueModel = require("../Venue/VenueModel");

const ShowModel = sequelize.define("showmodel", {
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
    eventId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bookingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    noSeatLayout: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

EventModel.hasMany(ShowModel, {
    foreignKey: "eventId",
    as: "shows",
});

ShowModel.belongsTo(EventModel, {
    foreignKey: "eventId",
    as: "event",
});

ShowModel.belongsTo(VenueModel, {
    foreignKey: "venueId",
    as: "venue",
});

VenueModel.hasMany(ShowModel, {
    foreignKey: "venueId",
    as: "shows",
});

module.exports = ShowModel;
