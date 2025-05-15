module.exports = (sequelize, DataTypes) => {
  const ParticipanteAhorro = sequelize.define('ParticipanteAhorro', {
    ahorro_id: DataTypes.INTEGER,
    usuario_id: DataTypes.INTEGER,
    aporte_total: DataTypes.DECIMAL(10, 2)
  }, {
    tableName: 'participantes_ahorro',
    timestamps: false
  });

  ParticipanteAhorro.associate = (models) => {
    ParticipanteAhorro.belongsTo(models.User, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });

    ParticipanteAhorro.belongsTo(models.AhorroCompartido, {
      foreignKey: 'ahorro_id',
      as: 'ahorro'
    });
  };

  return ParticipanteAhorro;
};
