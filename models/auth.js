const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Auth extends Model {}

Auth.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'auth_detail'
  })
  

module.exports = Auth