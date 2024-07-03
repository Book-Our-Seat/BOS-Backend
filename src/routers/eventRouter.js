const express = require("express");
const createEventController = require("../controllers/event/createEventController");
const eventRouter = express.Router();
const { adminAuthMiddleware } = require("../../middlewares/authMiddleware");


eventRouter.post("/", adminAuthMiddleware, createEventController);

module.exports = eventRouter
