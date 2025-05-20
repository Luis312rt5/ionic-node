const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('finanzasdb', 'root', 'Luchos21', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
