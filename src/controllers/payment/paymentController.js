const { Op } = require("@sequelize/core");
const sequelize = require("../../../config/config");
const BookingModel = require("../../models/Booking/BookingModel");
const PaymentModel = require("../../models/Booking/PaymentModel");
const ShowSeatModel = require("../../models/Booking/ShowSeatModel");
const {
    PaymentStatus,
    BookingStatus,
    ShowSeatStatus,
} = require("../../utils/enums");

const getPaymentStatusHandler = async (req, res, next) => {
    const user = req.user;
    const { id } = req.params;
    try {
        let payment = await PaymentModel.findOne({
            where: { userId: user.id, id },
        });

        if (!payment) {
            return res.status(404).json({ message: "No payment found!" });
        }

        res.status(200).json({ status: payment.status });
    } catch (error) {
        next(error);
    }
};

//TODO: move this to bookingService
const bookSeats = async (seatNums, transaction) => {
    await ShowSeatModel.update(
        { status: ShowSeatStatus.BOOKED },
        { where: { seatNumber: { [Op.in]: seatNums } } },
        { transaction }
    );
};

const freeSeats = async (seatNums, transaction) => {

    await ShowSeatModel.update(
        { status: ShowSeatStatus.AVAILABLE },
        { where: { seatNumber: { [Op.in]: seatNums } } },
        { transaction }
    );
};

const paymentGatewayWebhookHandler = async (req, res, next) => {
    const { paymentId, transactionId, status } = req.body;

    const transaction = await sequelize.startUnmanagedTransaction();

    try {
        let payment = await PaymentModel.findOne({
            where: { id: paymentId, transactionId: transactionId },
        });
        let booking = await BookingModel.findOne({
            where: { id: payment.bookingId },
        });

        if (!payment) {
            throw new Error("Couldn't find payment record!");
        }
        if (!booking) {
            throw new Error("Couldn't find booking record!");
        }
        payment.status = status;
        await payment.save({ transaction });
        // status can be - pending, success, failure
        if (status == PaymentStatus.SUCCESS) {
            booking.status = BookingStatus.BOOKED;
            booking.statusMessage = "All set for the show!";
            await booking.save({ transaction });
            await bookSeats(booking.seatNums, transaction);
        } else if (status == PaymentStatus.FAILURE) {
            booking.status = BookingStatus.FAILED;
            booking.statusMessage = "We didn't receive the payment!";
            await booking.save({ transaction });
            await freeSeats(booking.seatNums, transaction);
        } else if (status == PaymentStatus.PENDING) {
            booking.status = BookingStatus.PENDING;
            booking.statusMessage = "Awaiting Payment!";
            await booking.save({ transaction });
        } else {
            throw new Error("Invalid payment status received!");
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        //TODO: write to a log.
        console.log("::Webhook handling failed!:: Error: ", error);
    }
};

module.exports = { getPaymentStatusHandler, paymentGatewayWebhookHandler };
