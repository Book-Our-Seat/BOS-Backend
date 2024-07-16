const express = require("express");
const bookingRouter = express.Router();

const {
    authorizeAdminMiddleware,
    authorizeUserMiddleware,
} = require("../middlewares/authMiddleware");
const { getAllBookingsHandler, getOneBookingHandler, createBookingHandler } = require("../controllers/booking/bookingController");

bookingRouter.get("/", authorizeUserMiddleware, getAllBookingsHandler);
bookingRouter.get("/:id", authorizeUserMiddleware, getOneBookingHandler);
bookingRouter.post("/", authorizeUserMiddleware, createBookingHandler)

module.exports = bookingRouter;
