module.exports = (sequelize, DataTypes) => {
  const AhorroCompartido = sequelize.define('AhorroCompartido', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    meta: DataTypes.DECIMAL(10, 2),
    monto_actual: DataTypes.DECIMAL(10, 2),
    creador_id: DataTypes.INTEGER,
    fecha_creacion: DataTypes.DATE
  }, {
    tableName: 'ahorros_compartidos',
    timestamps: false
  });

  AhorroCompartido.associate = (models) => {
    if (models.User) {
      AhorroCompartido.belongsTo(models.User, {
        foreignKey: 'creador_id',
        as: 'creador'
      });
    }

    if (models.ParticipanteAhorro) {
      AhorroCompartido.hasMany(models.ParticipanteAhorro, {
        foreignKey: 'ahorro_id',
        as: 'participantes'
      });
    }
  };

  return AhorroCompartido;
};
