// Importar Sequelize
const sequelize = new Sequelize('finanzasdb', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // true si quieres ver consultas SQL en consola
});

module.exports = sequelize;
