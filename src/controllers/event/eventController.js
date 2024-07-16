const EventModel = require("../../models/Event/EventModel");
const { v4: uuidv4 } = require("uuid");
const ShowModel = require("../../models/Event/ShowModel");
const sequelize = require("../../../config/config");
const VenueModel = require("../../models/Venue/VenueModel");

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
                console.log({
                    id: uuidv4(),
                    venueId: show.venueId,
                    eventId: event.id,
                    startTime: show.startTime,
                    date: show.date,
                });
                return {
                    id: uuidv4(),
                    venueId: show.venueId,
                    eventId: event.id,
                    startTime: show.startTime,
                    date: show.date,
                };
            });
            await ShowModel.bulkCreate(showsParsed, { transaction });
            res.status(201).json({ message: "Event created successfully" });
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            next(error);
        }
    });
};

const getEventHandler = async (req, res, next) => {
    try {
        let events = await EventModel.findAll({
            include: [
                {
                    model: ShowModel,
                    attributes: ["id", "startTime", "date"],
                    separate: true,
                    include: [
                        {
                            model: VenueModel,
                            as: "venue",
                            attributes: ["name"],
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

module.exports = { createEventHandler, getEventHandler };
