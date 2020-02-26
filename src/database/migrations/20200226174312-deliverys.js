'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deliverys', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      email:{
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at:{
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at:{
        type: Sequelize.DATE,
        allowNull: false,
      },
    });    
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('deliverys');
  }
};
