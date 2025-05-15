'use strict';
module.exports = (sequelize, DataTypes) => {
  const Deuda = sequelize.define('Deuda', {
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    financiada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'deudas',
    timestamps: false
  });

  Deuda.associate = function(models) {
    Deuda.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };

  return Deuda;
};
