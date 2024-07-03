const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/sequelizeConfig");
const { v4: uuidv4 } = require("uuid");

const EventModel = sequelize.define("eventmodel", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING, //TODO: Change this to TEXT
        allowNull: true,
    },
    artistName: {
        type: DataTypes.STRING, //FIXME: can itself be a class
        allowNull: true,
    },
    duration: {
        type: DataTypes.STRING, //TODO: Change this to int or other type based on frontend
        allowNull: false,
    },
    ageLimit: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    posterLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});


module.exports = EventModel;
