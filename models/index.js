'use strict';

const { Sequelize } = require('sequelize');
const config = require(__dirname + '/../config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const db = {}; // ✅ Esta línea faltaba

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Movimiento = require('./Movimiento')(sequelize, Sequelize.DataTypes);
const Deuda = require('./Deuda')(sequelize, Sequelize.DataTypes);
const AhorroCompartido = require('./ahorro_compartido')(sequelize, Sequelize.DataTypes);
const ParticipanteAhorro = require('./participante_ahorro')(sequelize, Sequelize.DataTypes);

// Asignar modelos al objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.Movimiento = Movimiento;
db.Deuda = Deuda;
db.AhorroCompartido = AhorroCompartido;
db.ParticipanteAhorro = ParticipanteAhorro;

// ✅ Ejecutar asociaciones después de agregar todo al objeto db
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// Relaciones adicionales
User.hasMany(Movimiento, { foreignKey: 'user_id' });
User.hasMany(Deuda, { foreignKey: 'user_id' });

Movimiento.belongsTo(User, { foreignKey: 'user_id' });
Deuda.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Asignar modelos al objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.Movimiento = Movimiento;
db.Deuda = Deuda;
db.AhorroCompartido = AhorroCompartido;
db.ParticipanteAhorro = ParticipanteAhorro;

module.exports = db;
// Nota: Asegúrate de que los modelos User, Movimiento, Deuda, AhorroCompartido y ParticipanteAhorro estén correctamente definidos en sus respectivos archivos.