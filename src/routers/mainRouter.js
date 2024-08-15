const express = require('express')
const authRouter = require("./authRouter")
const eventRouter = require('./eventRouter');
const bookingRouter = require('./bookingRouter');
const paymentRouter = require('./paymentRouter');
const venueRouter = require('./venueRouter');
const adminRouter = require('./adminRouter');
const userRouter = require('./userRouter');

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/user", userRouter)
mainRouter.use("/event", eventRouter);
mainRouter.use("/booking", bookingRouter);
mainRouter.use("/payment", paymentRouter);
mainRouter.use("/venue", venueRouter);
mainRouter.use("/admin", adminRouter)

module.exports = mainRouter

