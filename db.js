const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('finanzasdb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
