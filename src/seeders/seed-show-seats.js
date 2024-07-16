'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ShowSeatModels', [
      {
        id: '5678abcd-1234-90ef-ghij-klmn7890opqr',
        seatNumber: 'A1',
        status: 'available',
        category: 'VIP',
        price: 100,
        bookingId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '6789abcd-1234-90ef-ghij-klmn7890opqr',
        seatNumber: 'A2',
        status: 'available',
        category: 'VIP',
        price: 100,
        bookingId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ShowSeatModels', null, {});
  }
};
