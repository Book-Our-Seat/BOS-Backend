const express = require('express')
const authRouter = require("./authRouter")
const eventRouter = require('./eventRouter');
const bookingRouter = require('./bookingRouter');
const paymentRouter = require('./paymentRouter');
const venueRouter = require('./venueRouter');

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/event", eventRouter);
mainRouter.use("/booking", bookingRouter);
mainRouter.use("/payment", paymentRouter);
mainRouter.use("/venue", venueRouter);

module.exports = mainRouter

