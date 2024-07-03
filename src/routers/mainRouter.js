const express = require('express')
const authRouter = require("./authRouter")
const { authMiddleware } = require("../middlewares/authMiddleware");
const eventRouter = require('./eventRouter');

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/event", eventRouter)

module.exports = mainRouter

