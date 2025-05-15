'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = function(models) {
    User.hasMany(models.Movimiento, { foreignKey: 'user_id' });
    User.hasMany(models.Deuda, { foreignKey: 'user_id' });
  };

  return User;
};
// Compare this snippet from migrations/20250515072316-create-users.js: