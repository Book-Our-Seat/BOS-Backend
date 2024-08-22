const express = require("express");
const venueRouter = express.Router();

const {
    authorizeAdminMiddleware,
    authorizeUserMiddleware,
} = require("../middlewares/authMiddleware");
const {
    createVenueHandler,
    getVenueHandler,
    getAllVenuesHandler,
} = require("../controllers/venue/venueController");

// this is needed for creating a new venue.
venueRouter.post("/", authorizeAdminMiddleware, createVenueHandler);

// this is needed when we show drop down during creating a show and selecting a venue.
venueRouter.get("/:id", authorizeAdminMiddleware, getVenueHandler);

venueRouter.get("/", authorizeAdminMiddleware, getAllVenuesHandler);

module.exports = venueRouter;
