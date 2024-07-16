const EventModel = require("../../models/Event/EventModel");
const { v4: uuidv4 } = require("uuid");
const ShowModel = require("../../models/Event/ShowModel");
const sequelize = require("../../../config/config");
const VenueModel = require("../../models/Venue/VenueModel");
const BookingModel = require("../../models/Booking/BookingModel");
const PaymentModel = require("../../models/Booking/PaymentModel");
const ShowSeatModel = require("../../models/Booking/ShowSeatModel");
const { Op } = require("@sequelize/core");
const {
    BookingStatus,
    PaymentStatus,
    ShowSeatStatus,
} = require("../../utils/enums");
const { initiatePayment } = require("../../services/paymentService");

//TODO: move this into .env
const EXPIRY_DURATION_MILLIS = 15 * 60000;

const getAllBookingsHandler = async (req, res, next) => {
    const user = req.user;
    try {
        let bookings = await BookingModel.findAll({
            where: { userId: user.id },
            attributes: ["id", "status", "seats"],
            include: [
                {
                    model: ShowModel,
                    as: "show",
                    attributes: ["id", "startTime", "date"],
                    include: [
                        {
                            model: VenueModel,
                            attributes: ["name"],
                            as: "venue",
                        },
                        {
                            model: EventModel,
                            as: "event",
                            attributes: [
                                "id",
                                "title",
                                "duration",
                                "posterLink",
                            ],
                        },
                    ],
                },
                {
                    model: PaymentModel,
                    as: "paymentDetails",
                    attributes: [
                        "id",
                        "transactionId",
                        "amount",
                        "timeStamp",
                        "paymentMethod",
                        "status",
                        "discountCouponId",
                    ],
                },
            ],
        });

        res.status(200).json({ bookings });
    } catch (error) {
        next(error);
    }
};

const getOneBookingHandler = async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    try {
        let booking = await BookingModel.findOne({
            where: { userId: user.id, id },
            attributes: ["id", "status", "seats"],
            include: [
                {
                    model: ShowModel,
                    as: "show",
                    attributes: ["id", "startTime", "date"],
                    include: [
                        {
                            model: VenueModel,
                            attributes: ["name"],
                            as: "venue",
                        },
                        {
                            model: EventModel,
                            as: "event",
                            attributes: [
                                "id",
                                "title",
                                "duration",
                                "posterLink",
                            ],
                        },
                    ],
                },
                {
                    model: PaymentModel,
                    as: "paymentDetails",
                    attributes: [
                        "id",
                        "transactionId",
                        "amount",
                        "timeStamp",
                        "paymentMethod",
                        "status",
                        "discountCouponId",
                    ],
                },
            ],
        });

        res.status(200).json({ booking });
    } catch (error) {
        next(error);
    }
};

/* Required: showId, eventId, showSeatIds + couponId
 * 1. User clicks on confirm booking on Booking Overview Screen. createBookingHandler is called.
 * * 1a. showId, eventId, showSeatIds are passed.
 * * 1b. firstly, check if seats are available.
 * * 1c. if yes, calculate amount.
 * 2. bookingService.blockSeats - We block the seats and create bookingModel
 * 3. Initiate payment is when you can create a payment model.
 */

// Flow -> first your clicks on confirm ticket ( createBooking Handler)
//

const checkIfAllSeatsAreAvailable = (showSeats) => {
    let init = true;
    return showSeats.reduce(
        (available, seat) =>
            available && seat.status == ShowSeatStatus.AVAILABLE,
        init
    );
};

const getSeatNumsConcatenated = (showSeats) => {
    return showSeats.map((seat) => seat.seatNumber);
};

const getExpiry = () => {
    return new Date(new Date().getTime() + EXPIRY_DURATION_MILLIS);
};

const getTotalPrice = (showSeats) => {
    let init = 0;
    return showSeats.reduce(
        (totalAmount, seat) => (totalAmount += seat.price),
        init
    );
};

const createBookingHandler = async (req, res, next) => {
    const { showId, eventId, showSeatIds, upiId } = req.body;
    const user = req.user;
    const transaction = await sequelize.startUnmanagedTransaction();
    let locked = false;
    try {
        let seats = await ShowSeatModel.findAll({
            where: {
                id: {
                    [Op.in]: showSeatIds,
                },
            },
            attributes: ["status", "price", "seatNumber"],
        });

        let amount = getTotalPrice(seats);

        // check if any of them is booked
        if (!checkIfAllSeatsAreAvailable(seats)) {
            return res.status(409).json({ message: "Seats unavailable!" });
        }

        await ShowSeatModel.update(
            { status: ShowSeatStatus.UNAVAILABLE },
            { where: { id: { [Op.in]: showSeatIds } } }
        );
        locked = true;

        const booking = await BookingModel.create(
            {
                userId: user.id,
                eventId: eventId,
                showId: showId,
                seats: getSeatNumsConcatenated(seats),
                status: BookingStatus.PENDING,
                statusMessage: "Booking initiated",
                _expiresAt: getExpiry(),
            },
            { transaction }
        );

        const payment = await PaymentModel.create(
            {
                bookingId: booking.id,
                userId: user.id,
                amount,
                timeStamp: new Date().getTime(),
                paymentMethod: "UPI",
                status: PaymentStatus.INVALID,
            },
            { transaction }
        );

        const paymentResponse = await initiatePayment(user.id, amount);

        payment.transactionId = paymentResponse.paymentId;
        payment.status = paymentResponse.status;

        await payment.save({ transaction });

        await transaction.commit();

        res.status(201).json({
            message: "Booking Initiated",
            bookingId: booking.id,
            paymentId: payment.id,
        });
    } catch (error) {
        if (locked) {
            await ShowSeatModel.update(
                { status: ShowSeatStatus.AVAILABLE },
                { where: { id: { [Op.in]: showSeatIds } } }
            );
            locked = false;
        }
        await transaction.rollback();
        next(error);
    }
};

module.exports = {
    getAllBookingsHandler,
    getOneBookingHandler,
    createBookingHandler,
};

// Overall problem seems to be payment initiated but db fails => seems extreme for now.
