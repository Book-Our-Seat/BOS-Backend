const { DataTypes } = require("@sequelize/core");
const sequelize = require("../../../config/config");
const { v4: uuidv4 } = require("uuid");
const { PaymentStatus } = require("../../utils/enums");

const PaymentModel = sequelize.define("paymentmodel", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
    },
    bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    transactionId: {
        type: DataTypes.STRING,
    },
    discountCouponId: {
        type: DataTypes.UUID,
    },
    amount: {
        type: DataTypes.INTEGER,
        defaultValue: uuidv4,
        allowNull: false,
    },
    timeStamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(Object.values(PaymentStatus)),
        defaultValue: PaymentStatus.INVALID,
    },
});

module.exports = PaymentModel;
