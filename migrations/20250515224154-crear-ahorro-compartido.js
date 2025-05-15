'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ahorros_compartidos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      meta: {
        type: Sequelize.DECIMAL(10, 2)
      },
      monto_actual: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      creador_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.createTable('participantes_ahorro', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ahorro_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ahorros_compartidos',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      aporte_total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('participantes_ahorro');
    await queryInterface.dropTable('ahorros_compartidos');
  }
};
