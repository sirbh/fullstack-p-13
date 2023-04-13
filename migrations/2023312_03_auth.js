const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN
    })
    await queryInterface.createTable('auth_details', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        token:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
      })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users','disabled')
    await queryInterface.dropTable('auth_details')
  },
}