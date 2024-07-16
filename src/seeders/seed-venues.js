'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('VenueModels', [
      {
        id: '9z8y7x6w-5v4u-3t2s-1r0p-q9o8n7m6l5k4',
        name: 'Main Venue',
        addressLine1: '789 Venue St',
        city: 'Metropolis',
        state: 'NY',
        pincode: '12345',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('VenueModels', null, {});
  }
};
