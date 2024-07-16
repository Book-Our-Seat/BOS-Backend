'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('EventModels', [
      {
        id: '1c2b3d4e-5f67-4a3b-8c23-5a89d33e6d8b',
        title: 'Concert',
        description: 'A great concert event',
        artistName: 'Artist Name',
        duration: '120',
        ageLimit: '18+',
        posterLink: 'https://example.com/concert.jpg',
        category: 'Music',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('EventModels', null, {});
  }
};
