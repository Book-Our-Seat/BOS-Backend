const sequelize = require("../../config/config");
const BookingModel = require("../models/Booking/BookingModel");
const ShowSeatModel = require("../models/Booking/ShowSeatModel");
const EventModel = require("../models/Event/EventModel");
const ShowModel = require("../models/Event/ShowModel");
const UserModel = require("../models/UserModel");
const VenueModel = require("../models/Venue/VenueModel");
const VenueLayoutModel = require("../models/Venue/VenueLayoutModel");
const VenueSeatModel = require("../models/Venue/VenueSeatModel");
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
                coins: 100,
                approvalStatus: false,
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
                approvalStatus: true,
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

        await VenueLayoutModel.create({
            id: "c55c29a3-87d5-466d-90e9-035606ce4ed8",
            venueId: "e4b2c3d4-5f6e-7a8b-9c1d-0e2f3b4c5d6a",
            totalSeats: 5,
            rowCount: 3,
            columnCount: 3,
            layout: "_a_|aaa|_a_",
            rowLabels: ["A", "B", "C"],
            columnLabels: ["1", "2", "3"],
        });

        await VenueSeatModel.bulkCreate([
            {
                id: "4beb5d0c-f2e9-470c-bc0e-1e86b2264c64",
                venueLayoutId: "c55c29a3-87d5-466d-90e9-035606ce4ed8",
                seatNumber: "A2",
                coordinates: [1, 2],
            },
            {
                id: "0ee79cd3-0af5-4b8b-8825-cce6d180f412",
                venueLayoutId: "c55c29a3-87d5-466d-90e9-035606ce4ed8",
                seatNumber: "B1",
                coordinates: [2, 1],
            },
            {
                id: "23022b76-e558-40d5-97fd-f6cce9b1d77a",
                venueLayoutId: "c55c29a3-87d5-466d-90e9-035606ce4ed8",
                seatNumber: "B2",
                coordinates: [2, 2],
            },
            {
                id: "1315f5cb-6c66-44ce-a3a1-311f412d046d",
                venueLayoutId: "c55c29a3-87d5-466d-90e9-035606ce4ed8",
                seatNumber: "B3",
                coordinates: [2, 3],
            },
            {
                id: "36c98b52-00df-4da8-b43b-1cc96541aa4d",
                venueLayoutId: "c55c29a3-87d5-466d-90e9-035606ce4ed8",
                seatNumber: "C2",
                coordinates: [3, 2],
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
                seatNumber: "A2",
                coordinates: [1, 2],
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
                seatNumber: "B1",
                coordinates: [2, 1],
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
