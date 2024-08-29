const { v4: uuidv4 } = require("uuid");
const sequelize = require("../../../config/config");
const VenueModel = require("../../models/Venue/VenueModel");
const VenueLayoutModel = require("../../models/Venue/VenueLayoutModel");
const VenueSeatModel = require("../../models/Venue/VenueSeatModel");

const checkIfAllLayoutDetailsAreProvided = (layoutDetails) => {
    if (!layoutDetails.totalSeats) {
        return [false, "`seats` are required!"];
    }
    if (!layoutDetails.rowLabels) {
        return [false, "`rowLabels are required!"];
    }
    if (!layoutDetails.rowCount) {
        return [false, "`rowCount` is required!"];
    }
    if (!layoutDetails.columnCount) {
        return [false, "`columnCount` is required!"];
    }
    if (!layoutDetails.layout) {
        return [false, "`layout(string)` is required!"];
    }
    return [true, ""]
};
// layout has seat numbers as well.
// TODO: Handling cases were layout is not provided!
const createVenueHandler = async (req, res, next) => {
    let { name, layoutDetails, addressLine1, city, state, pincode } = req.body;

    let [isAllLayoutDetailsProvided, message] =
        checkIfAllLayoutDetailsAreProvided(layoutDetails);

    if (!isAllLayoutDetailsProvided) {
        return res
            .status(400)
            .json({ message: `Missing in VenueLayout: ${message}` });
    }

    const transaction = await sequelize.startUnmanagedTransaction();
    try {
        // create venue
        // create layout
        let venue = await VenueModel.create(
            {
                name,
                addressLine1,
                city,
                state,
                pincode,
            },
            { transaction }
        );

        let venueLayout = await VenueLayoutModel.create(
            {
                totalSeats: layoutDetails.totalSeats,
                rowCount: layoutDetails.rowCount,
                columnCount: layoutDetails.columnCount,
                layout: layoutDetails.layout,
                rowLabels: layoutDetails.rowLabels,
                columnLabels: layoutDetails.columnLabels,
                venueId: venue.id,
            },
            { transaction }
        );
        console.log(venueLayout.id);
        await VenueSeatModel.bulkCreate(
            layoutDetails.seats.map((seat) => {
                return {
                    venueLayoutId: venueLayout.id,
                    seatNumber: seat.seatNumber,
                    coordinates: seat.coordinates,
                };
            }),
            { transaction }
        );

        await transaction.commit();
        res.status(201).json({ message: "Venue Created!" });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

const getVenueHandler = async (req, res, next) => {
    let { id } = req.params;
    try {
        let venue = await VenueModel.findOne({
            where: { id },
            include: [
                {
                    model: VenueLayoutModel,
                    attributes: {
                        exclude: ["venueId", "createdAt", "updatedAt"],
                    },
                    include: {
                        model: VenueSeatModel,
                        attributes: {
                            exclude: [
                                "venueLayoutId",
                                "createdAt",
                                "updatedAt",
                            ],
                        },
                        separate: true,
                    },
                },
            ],
        });
        if (venue) {
            res.status(200).json({ venue });
        } else {
            res.status(404).json({ message: "No venue found!" });
        }
    } catch (error) {
        next(error);
    }
};

const getAllVenuesHandler = async (req, res, next) => {
    try {
        let venues = await VenueModel.findAll({
            include: [
                {
                    model: VenueLayoutModel,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    include: {
                        model: VenueSeatModel,
                        attributes: {
                            exclude: [
                                "venueLayoutId",
                                "createdAt",
                                "updatedAt",
                            ],
                        },
                        separate: true,
                    },
                },
            ],
        });

        res.status(200).json({ venues });
    } catch (error) {
        next(error);
    }
};

module.exports = { createVenueHandler, getVenueHandler, getAllVenuesHandler };
