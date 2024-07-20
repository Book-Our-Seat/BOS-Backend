const express = require("express");
const {
    createEventHandler,
    getEventHandler,
    getAllEventsHandler,
    getEventLayoutHandler,
} = require("../controllers/event/eventController");
const eventRouter = express.Router();

const {
    authorizeAdminMiddleware,
    authorizeUserMiddleware,
} = require("../middlewares/authMiddleware");

eventRouter.post("/", authorizeAdminMiddleware, createEventHandler);

eventRouter.get("/:showId/layout", authorizeUserMiddleware, getEventLayoutHandler);

eventRouter.get("/:id", authorizeUserMiddleware, getEventHandler);

eventRouter.get("/", authorizeUserMiddleware, getAllEventsHandler);

module.exports = eventRouter;
