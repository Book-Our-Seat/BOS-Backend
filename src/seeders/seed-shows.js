'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ShowModels', [
      {
        id: 'e3d4f5g6-h7i8-9j0k-l1m2-n3o4p5q6r7s8',
        venueId: '9z8y7x6w-5v4u-3t2s-1r0p-q9o8n7m6l5k4', // Replace with a valid venueId
        eventId: '1c2b3d4e-5f67-4a3b-8c23-5a89d33e6d8b', // Replace with a valid eventId
        startTime: '18:00',
        date: '2024-08-01',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ShowModels', null, {});
  }
};
