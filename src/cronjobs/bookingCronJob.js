const cron = require("node-cron");
const sequelize = require("../../config/config");
const { BookingStatus, ShowSeatStatus } = require("../utils/enums");
const BookingModel = require("../models/Booking/BookingModel");
const { Op } = require("@sequelize/core");
const ShowSeatModel = require("../models/Booking/ShowSeatModel");

const freeSeats = async (seatNums, transaction) => {
    await ShowSeatModel.update(
        { status: ShowSeatStatus.AVAILABLE },
        { where: { seatNumber: { [Op.in]: seatNums } },
            transaction,
        }
    );
};

const expireBooking = async (booking) => {
    const transaction = await sequelize.startUnmanagedTransaction();
    try {
        booking.status = BookingStatus.FAILED;
        booking.statusMessage = "Timed out!";
        await booking.save({ transaction });
        await freeSeats(booking.seats, transaction);
        await transaction.commit();
        console.log(`::Successfully expired booking: ${booking.id}::`);
    } catch (error) {
        await transaction.rollback();
        console.log(
            `::Failed to expire booking: ${booking.id}:: Error:`,
            error
        );
    }
};

// Cron job scheduled at every fifteen minutes.
cron.schedule("*/15 * * * *", async () => {
    try {
        console.log("::Cron Job Triggered::");

        const now = new Date();

        const expiredBookings = await BookingModel.findAll({
            where: {
                _expiresAt: {
                    [Op.lt]: now,
                },
                status: BookingStatus.PENDING,
            },
        });

        for (const booking of expiredBookings) {
            await expireBooking(booking);
        }

        console.log("::Cron Job Completed::");
    } catch (error) {
        console.error("::Cron Job Failed:: Error: ", error);
    }
});
