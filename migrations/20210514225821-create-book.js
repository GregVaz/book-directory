'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      publication_date: {
        type: Sequelize.DATE
      },
      abstract: {
        type: Sequelize.TEXT
      },
      cover: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'email'
        },
        allowNull: false
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Books');
  }
};