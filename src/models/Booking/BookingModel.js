const { DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/config");
const { v4: uuidv4 } = require("uuid");
const EventModel = require("../Event/EventModel");
const ShowModel = require("../Event/ShowModel");
const PaymentModel = require("./PaymentModel");
const { BookingStatus } = require("../../utils/enums");

/*
 * Information Required
 * User Related: UserId
 * Event Related: Image, Name, duration
 * Show Related: Date, Time
 * Seat: Count, Numbers
 * Payment: Amount, Status, Booking time. <- this to included in particular booking
 * Status: Ticket Usage Status. //TODO: Think more here
 */

const BookingModel = sequelize.define("BookingModel", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    showId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    /*HACK : 
        Following looks good as we can have bookings which have failed. 
        For these, we dont assign the corresponding seats a Booking ID. 
    */
    seats: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    seatCategories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    qrCode: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM(Object.values(BookingStatus)),
        defaultValue: BookingStatus.INVALID,
    },
    statusMessage: {
        type: DataTypes.STRING,
    },
    _expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

// Associations
ShowModel.hasMany(BookingModel, {
    foreignKey: "showId",
    as: "bookings",
});

BookingModel.belongsTo(ShowModel, {
    foreignKey: "showId",
    as: "show",
});

BookingModel.hasOne(PaymentModel, {
    foreignKey: "bookingId",
    as: "paymentDetails",
});

PaymentModel.belongsTo(BookingModel, {
    foreignKey: "bookingId",
    as: "booking",
});

module.exports = BookingModel;
