const BookingModel = require("../../models/Booking/BookingModel");
const UserModel = require("../../models/UserModel");
const { BookingStatus } = require("../../utils/enums");

const getUsersHandler = async (req, res, next) => {
    try {
        const users = await UserModel.findAll({
            where: { role: "user" },
            attributes: ["id", "name", "email", "approvalStatus", "coins"],
        });
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateUserInfoHandler = async (req, res, next) => {
    try {
        let { userInfo } = req.body;
        const user = await UserModel.findOne({ where: { id: userInfo.id } });
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        user.coins = userInfo.coins;
        user.approvalStatus = userInfo.approvalStatus;
        await user.save();
        res.status(201).json({ message: "Updated Successfully!" });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const verifyBookingHandler = async (req, res, next) => {
    try {
        let { bookingId } = req.body;
        const booking = await BookingModel.findOne({
            where: { id: bookingId },
        });

        if (!booking) {
            return res
                .status(404)
                .json({ message: "No booking found!", booking: {} });
        }

        if (booking.status == BookingStatus.BOOKED) {
            booking.status = BookingStatus.FINISHED;
            booking.statusMessage = "Hope you liked the show!";
            await booking.save();
            return res.status(201).json({
                message: "Verification successful!",
                booking: {
                    id: booking.id,
                    userId: booking.userId,
                    showId: booking.showId,
                    seats: booking.seats,
                },
            });
        }
        return res.status(409).json({
            message: "Verification unsuccessful!",
            booking: {},
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = {
    getUsersHandler,
    updateUserInfoHandler,
    verifyBookingHandler,
};
