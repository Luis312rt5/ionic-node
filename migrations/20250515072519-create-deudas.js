'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('deudas', {
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
        },
        onDelete: 'CASCADE'
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      fecha: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      financiada: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('deudas');
  }
};