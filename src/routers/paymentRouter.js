const express = require("express");
const paymentRouter = express.Router();

const {
    authorizeAdminMiddleware,
    authorizeUserMiddleware,
} = require("../middlewares/authMiddleware");
const {
    getAllBookingsHandler,
    getOneBookingHandler,
    createBookingHandler,
} = require("../controllers/booking/bookingController");
const {
    getPaymentStatusHandler,
    paymentGatewayWebhookHandler,
} = require("../controllers/payment/paymentController");

paymentRouter.get(
    "/status/:id",
    authorizeUserMiddleware,
    getPaymentStatusHandler
);

paymentRouter.post(
    "/webhook",
    paymentGatewayWebhookHandler
)

module.exports = paymentRouter;
