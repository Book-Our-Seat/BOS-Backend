const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/sequelizeConfig");
const { v4: uuidv4 } = require("uuid");
const EventModel = require("./EventModel");
const VenueModel = require("./VenueModel");

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
