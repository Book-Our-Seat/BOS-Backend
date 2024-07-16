'use strict';

const { v4: uuidv4 } = require('uuid');
const { BookingStatus } = require('../../utils/enums');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('BookingModels', [
      {
        id: 'abcd1234-5678-90ef-ghij-klmn7890opqr',
        userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851', // Replace with a valid userId
        eventId: '1c2b3d4e-5f67-4a3b-8c23-5a89d33e6d8b', // Replace with a valid eventId
        showId: 'e3d4f5g6-h7i8-9j0k-l1m2-n3o4p5q6r7s8', // Replace with a valid showId
        seats: ['A1', 'A2'],
        qrCode: null,
        status: BookingStatus.VALID,
        statusMessage: 'Confirmed',
        _expiresAt: new Date(new Date().getTime() + 15 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('BookingModels', null, {});
  }
};
