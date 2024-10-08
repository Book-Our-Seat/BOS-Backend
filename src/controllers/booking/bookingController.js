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
const UserModel = require("../../models/UserModel");
const { generateQRCode } = require("../../utils/qrcode");

//TODO: move this into .env
const EXPIRY_DURATION_MILLIS = 15 * 60000;

const getAllBookingsHandler = async (req, res, next) => {
    const user = req.user;
    try {
        let bookings = await BookingModel.findAll({
            where: { userId: user.id },
            attributes: ["id", "status", "seats", "qrCode", "seatCategories"],
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
            attributes: ["id", "status", "seats", "qrCode", "seatCategories"],
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

const getSeatCategoriesConcatenated = (showSeats) => {
    let categoryMap = new Map();
    showSeats.forEach((seat) => {
        categoryMap.set(
            seat.category,
            (categoryMap.get(seat.seatNumber) ?? 0) + 1
        );
    });
    let str = [];
    categoryMap.forEach((value, key) => {
        str.push(key + "-" + value);
    });
    return str;
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
        /* Check for existence of show.
            const show = await ShowModel.findOne({
                where: { id: showId },
            });
            if (!show) {
                return res.status(404).json({ message: "No such show exists!" });
            }
        */
        let seats = await ShowSeatModel.findAll({
            where: {
                id: {
                    [Op.in]: showSeatIds,
                },
            },
            attributes: ["status", "price", "seatNumber", "category"],
        });

        let amount = getTotalPrice(seats);
        let userBalance = (
            await UserModel.findOne({
                where: { id: user.id },
                attributes: ["coins"],
            })
        ).coins;

        // check if any of them is booked
        if (userBalance < amount) {
            return res.status(409).json({ message: "Insufficient coins!" });
        }

        if (!checkIfAllSeatsAreAvailable(seats)) {
            return res.status(409).json({ message: "Seats unavailable!" });
        }

        await ShowSeatModel.update(
            { status: ShowSeatStatus.SOLD },
            { where: { id: { [Op.in]: showSeatIds } } },
            { transaction }
        );

        await UserModel.update(
            { coins: userBalance - amount },
            { where: { id: user.id } },
            { transaction }
        );
        // locked = true;

        const bookingId = uuidv4();
        const qrCode = await generateQRCode(bookingId);

        const booking = await BookingModel.create(
            {
                id: bookingId,
                userId: user.id,
                eventId: eventId,
                showId: showId,
                seats: getSeatNumsConcatenated(seats),
                seatCategories: getSeatCategoriesConcatenated(seats),
                status: BookingStatus.BOOKED,
                qrCode,
                statusMessage: "Booked",
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
                paymentMethod: "Coins",
                status: PaymentStatus.SUCCESS,
            },
            { transaction }
        );

        /* Initiate Payment Gateway 
            const paymentResponse = await initiatePayment(user.id, amount);
            payment.transactionId = paymentResponse.paymentId || "invl";
            payment.status = paymentResponse.status;
            await payment.save({ transaction });
         */
        await ShowModel.increment("bookingCount", {
            by: 1,
            where: { id: showId },
            transaction,
        });

        await transaction.commit();

        res.status(201).json({
            message: "Booking Successful!",
            bookingId: booking.id,
            qrCode,
            paymentId: payment.id,
        });
    } catch (error) {
        /* Unlock locked seats
        if (locked) {
            await ShowSeatModel.update(
                { status: ShowSeatStatus.AVAILABLE },
                { where: { id: { [Op.in]: showSeatIds } } }
            );
            locked = false;
        }
*/
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
