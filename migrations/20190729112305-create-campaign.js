'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      trendingLocation: {
        type: Sequelize.STRING
      },
      customSearchTerm: {
        type: Sequelize.STRING
      },
      frequency: {
        type: Sequelize.FLOAT
      },
      includeTargetHandle: {
        type: Sequelize.BOOLEAN
      },
      includeTargetHashtag: {
        type: Sequelize.BOOLEAN
      },
      customHashtags: {
        type: Sequelize.BOOLEAN
      },
      tweets: {
        // type: Sequelize.JSON
        type: Sequelize.ARRAY(Sequelize.JSON)
      },
      mad: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Campaigns');
  }
};