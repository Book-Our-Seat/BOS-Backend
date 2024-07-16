const sequelize = require("../../config/config");
const BookingModel = require("../models/Booking/BookingModel");
const ShowSeatModel = require("../models/Booking/ShowSeatModel");
const EventModel = require("../models/Event/EventModel");
const ShowModel = require("../models/Event/ShowModel");
const UserModel = require("../models/UserModel");
const VenueModel = require("../models/Venue/VenueModel");
const { BookingStatus, ShowSeatStatus } = require("../utils/enums");
const becrypt = require("bcryptjs");

const seed = async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    try {
        await UserModel.bulkCreate([
            {
                id: "7a6f9e2b-3c4a-4e2e-a0c4-ace1d2b3c4f5",
                name: "John Doe",
                phone: "1234567890",
                email: "john.doe@example.com",
                password: becrypt.hashSync("password123", 8),
                address: "123 Main St",
                role: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "b2a179f0-3a2d-4efb-9b6f-7f1d7c0e5d9a",
                name: "Admin User",
                phone: "0987654321",
                email: "admin@example.com",
                password: becrypt.hashSync("adminpassword", 8),
                address: "456 Admin St",
                role: "admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
        await VenueModel.bulkCreate([
            {
                id: "e4b2c3d4-5f6e-7a8b-9c1d-0e2f3b4c5d6a",
                name: "Main Venue",
                addressLine1: "789 Venue St",
                city: "Metropolis",
                state: "NY",
                pincode: "12345",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        await EventModel.bulkCreate([
            {
                id: "8c1a2b3e-4d5f-6a7b-8c9d-0e1f2b3c4d5a",
                title: "Concert",
                description: "A great concert event",
                artistName: "Artist Name",
                duration: "120",
                ageLimit: "18+",
                posterLink: "https://example.com/concert.jpg",
                category: "Music",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
        await ShowModel.bulkCreate([
            {
                id: "2b43d769-d3fb-4a9b-89df-6b8bcf96039f",
                venueId: "e4b2c3d4-5f6e-7a8b-9c1d-0e2f3b4c5d6a", // Replace with a valid venueId
                eventId: "8c1a2b3e-4d5f-6a7b-8c9d-0e1f2b3c4d5a", // Replace with a valid eventId
                startTime: "18:00",
                date: "2024-08-01",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
        await ShowSeatModel.bulkCreate([
            {
                id: "2b43d769-d3fb-4a9b-89df-6b8bcf96039f",
                showId: "2b43d769-d3fb-4a9b-89df-6b8bcf96039f",
                seatNumber: "A1",
                status: ShowSeatStatus.AVAILABLE,
                category: "VIP",
                price: 100,
                bookingId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "4a4eb814-f456-46f1-9173-6b5c897b0eb8",
                showId: "2b43d769-d3fb-4a9b-89df-6b8bcf96039f",
                seatNumber: "A2",
                status: ShowSeatStatus.AVAILABLE,
                category: "VIP",
                price: 100,
                bookingId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
        await BookingModel.bulkCreate([
            {
                id: "f0e1d2c3-4b5a-6e7f-8c9d-0a1b2c3d4e5f",
                userId: "7a6f9e2b-3c4a-4e2e-a0c4-ace1d2b3c4f5", // Replace with a valid userId
                eventId: "8c1a2b3e-4d5f-6a7b-8c9d-0e1f2b3c4d5a", // Replace with a valid eventId
                showId: "2b43d769-d3fb-4a9b-89df-6b8bcf96039f", // Replace with a valid showId
                seats: ["A1", "A2"],
                qrCode: null,
                status: BookingStatus.VALID,
                statusMessage: "Confirmed",
                _expiresAt: new Date(new Date().getTime() + 15 * 60 * 1000),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    } catch (error) {
        console.log(error);
    }
};

seed();
