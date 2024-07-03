const EventModel = require("../../models/Event/EventModel");
const { v4: uuidv4 } = require("uuid");
const ShowModel = require("../../models/Event/ShowModel");

const createEventController = async (req, res, next) => {
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

    const transaction = await sequelize.transaction();

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
        console.log(`::shows: ${showsParsed}`);
        await ShowModel.bulkCreate(showsParsed, { transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

module.exports = createEventController;
