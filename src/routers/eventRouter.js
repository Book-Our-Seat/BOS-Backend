const express = require("express");
const {
    createEventHandler,
    getEventHandler,
} = require("../controllers/event/createEventController");
const eventRouter = express.Router();

const {
    authorizeAdminMiddleware,
    authorizeUserMiddleware,
} = require("../middlewares/authMiddleware");

eventRouter.post("/", authorizeAdminMiddleware, createEventHandler);
eventRouter.get("/", authorizeUserMiddleware, getEventHandler);

module.exports = eventRouter;
