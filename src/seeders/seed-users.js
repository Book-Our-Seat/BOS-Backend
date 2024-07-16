'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        name: 'John Doe',
        phone: '1234567890',
        email: 'john.doe@example.com',
        password: 'password123',
        address: '123 Main St',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5d45f7b2-f2d3-44d6-a812-927b9dfd22d2',
        name: 'Admin User',
        phone: '0987654321',
        email: 'admin@example.com',
        password: 'adminpassword',
        address: '456 Admin St',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
