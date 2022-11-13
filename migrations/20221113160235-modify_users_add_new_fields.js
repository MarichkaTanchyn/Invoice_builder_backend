'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    //user = company
    // comments = people
    return Promise.all([
      queryInterface.addConstraint('People', ['CompanyId'], {
        type: 'foreign key',
        name: 'fk_people_companies',
        references: {
          table: 'Companies',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
      queryInterface.addConstraint('Employees', ['PersonId'], {
        type: 'foreign key',
        name: 'fk_employees_people',
        references: {
          table: 'People',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
