'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'deliverys',
      'avatar_id',
      {
        type: Sequelize.INTEGER,
        referencer: {model: 'files', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('deliverys', 'avatar_id')
  }
};
