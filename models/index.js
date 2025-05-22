'use strict';

const { Sequelize } = require('sequelize');
const config = require(__dirname + '/../config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const DataTypes = Sequelize.DataTypes; // ✅ ESTA LÍNEA ES NECESARIA

const db = {};

const User = require('./User')(sequelize, DataTypes);
const Movimiento = require('./Movimiento')(sequelize, DataTypes);
const Deuda = require('./Deuda')(sequelize, DataTypes);
const AhorroCompartido = require('./ahorro_compartido')(sequelize, DataTypes);
const ParticipanteAhorro = require('./participante_ahorro')(sequelize, DataTypes);
const Aporte = require('./aporte')(sequelize, DataTypes);

// Asignar modelos al objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.Movimiento = Movimiento;
db.Deuda = Deuda;
db.AhorroCompartido = AhorroCompartido;
db.ParticipanteAhorro = ParticipanteAhorro;
db.Aporte = Aporte;

// Ejecutar asociaciones
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

module.exports = db;
