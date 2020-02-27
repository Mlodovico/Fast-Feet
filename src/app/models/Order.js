import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Order extends Model {
  static init(sequelize){
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get(){
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2))
          }
        },
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
        tableName: "orders",
      });

      return this;
  }

  static associate(models){
    this.belongsTo(models.Recipient, { foreignKey: 'recipient_id', as: 'recipient'});
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
  }

}

export default Order;