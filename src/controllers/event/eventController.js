const EventModel = require("../../models/Event/EventModel");
const { v4: uuidv4 } = require("uuid");
const ShowModel = require("../../models/Event/ShowModel");
const sequelize = require("../../../config/config");
const VenueModel = require("../../models/Venue/VenueModel");
const ShowSeatModel = require("../../models/Booking/ShowSeatModel");
const VenueLayoutModel = require("../../models/Venue/VenueLayoutModel");
const { default: Sequelize } = require("@sequelize/core");
const BookingModel = require("../../models/Booking/BookingModel");

const createEventHandler = async (req, res, next) => {
    const {
        title,
        description,
        artistName,
        duration,
        ageLimit,
        posterLink,
        category,
        shows,
    } = req.body;

    sequelize.transaction(async (transaction) => {
        try {
            let event = await EventModel.create(
                {
                    title,
                    description,
                    artistName,
                    duration,
                    ageLimit,
                    posterLink,
                    category,
                },
                { transaction }
            );

            let showsParsed = shows.map((show) => {
                return {
                    id: uuidv4(),
                    venueId: show.venueId,
                    eventId: event.id,
                    startTime: show.startTime,
                    date: show.date,
                };
            });

            //TODO: verify if the seats actually correspond to venueSeats.
            let showSeatsSet = [];
            shows.forEach((show, index) => {
                showSeatsSet.push(
                    show.showSeats.map((seat) => {
                        return {
                            id: uuidv4(),
                            seatNumber: seat.seatNumber,
                            coordinates: seat.coordinates,
                            status: seat.status,
                            category: seat.category,
                            price: seat.price,
                            showId: showsParsed[index].id,
                        };
                    })
                );
            });

            let createShowSeats = showSeatsSet.map((showSeats) =>
                ShowSeatModel.bulkCreate(showSeats, { transaction })
            );
            await Promise.all(createShowSeats);

            await ShowModel.bulkCreate(showsParsed, { transaction });

            res.status(201).json({ message: "Event created successfully" });
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            next(error);
        }
    });
};

const getAllEventsHandler = async (req, res, next) => {
    try {
        let events = await EventModel.findAll({
            include: [
                {
                    model: ShowModel,
                    attributes: ["id", "startTime", "date", "bookingCount"],
                    separate: true,
                    include: [
                        {
                            model: VenueModel,
                            as: "venue",
                            attributes: { exclude: ["id"] },
                        },
                    ],
                },
            ],
        });

        res.status(200).json({ events });
    } catch (error) {
        next(error);
    }
};

const getEventHandler = async (req, res, next) => {
    const { id } = req.params;
    try {
        let events = await EventModel.findOne(
            { where: { id } },
            {
                include: [
                    {
                        model: ShowModel,
                        attributes: ["id", "startTime", "date"],
                        separate: true,
                        include: [
                            {
                                model: VenueModel,
                                as: "venue",
                                attributes: { exclude: ["id"] },
                            },
                        ],
                    },
                ],
            }
        );
        res.status(200).json({ events });
    } catch (error) {
        next(error);
    }
};

const getEventLayoutHandler = async (req, res, next) => {
    let { showId } = req.params;
    try {
        let show = await ShowModel.findOne({
            where: { id: showId },
            include: [
                {
                    association: ShowModel.associations.venue, //TODO: whats wrong here?
                    attributes: ["id"],
                    include: [
                        {
                            model: VenueLayoutModel,
                            attributes: {
                                exclude: ["venueId", "createdAt", "updatedAt"],
                            },
                        },
                    ],
                },
            ],
        });

        let showSeats = await ShowSeatModel.findAll({
            where: { showId },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        if (!show) {
            return res.status(404).json({ message: "No show found!" });
        }
        if (!showSeats) {
            return res.status(404).jsons({ message: "No show seats found!" });
        }

        res.status(200).json({
            showId: show.id,
            showVenueLayout: show.venue.venueLayout,
            showSeats,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEventHandler,
    getAllEventsHandler,
    getEventHandler,
    getEventLayoutHandler,
};
