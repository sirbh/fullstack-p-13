const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull:false
    },
    title: {
      type: DataTypes.STRING,
      allowNull:false
    },
    likes:{
      type: DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    year:{
      type:DataTypes.INTEGER,
      validate:{
        min:1991,
        max:new Date().getFullYear()
      }
    }
  }, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog'
  })
  

module.exports = Blog