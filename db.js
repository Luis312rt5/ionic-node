const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('finanzasdb', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
