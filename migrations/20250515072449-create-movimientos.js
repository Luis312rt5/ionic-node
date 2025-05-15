'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('movimientos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      tipo: {
        type: Sequelize.ENUM('ingreso', 'gasto'),
        allowNull: false
      },
      cantidad: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING
      },
      fecha: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('movimientos');
  }
};