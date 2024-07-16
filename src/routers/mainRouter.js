const express = require('express')
const authRouter = require("./authRouter")
const eventRouter = require('./eventRouter');
const bookingRouter = require('./bookingRouter');
const paymentRouter = require('./paymentRouter');

const mainRouter = express.Router();
//TODO: Get rid of this extra layer.
mainRouter.use("/auth", authRouter);
mainRouter.use("/event", eventRouter);
mainRouter.use("/booking", bookingRouter);
mainRouter.use("/payment", paymentRouter)

module.exports = mainRouter

