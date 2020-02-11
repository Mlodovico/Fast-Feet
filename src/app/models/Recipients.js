import { Model, Sequelize } from 'sequelize';

class Recipients extends Model { 
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        postal_code: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

}

export default Recipients;