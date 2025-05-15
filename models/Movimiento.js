'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movimiento = sequelize.define('Movimiento', {
    tipo: {
      type: DataTypes.ENUM('ingreso', 'gasto'),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'movimientos',
    timestamps: false
  });

  Movimiento.associate = function(models) {
    Movimiento.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Movimiento;
};
