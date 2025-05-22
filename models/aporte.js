'use strict';

module.exports = (sequelize, DataTypes) => {
  const Aporte = sequelize.define('Aporte', {
    ahorro_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'aportes',
    timestamps: false
  });

  Aporte.associate = (models) => {
    Aporte.belongsTo(models.User, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });

    Aporte.belongsTo(models.AhorroCompartido, {
      foreignKey: 'ahorro_id',
      as: 'ahorro'
    });
  };

  return Aporte;
};
