import Delivery from '../models/Delivery';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

import { Op } from 'sequelize';

class DeliveryManOrderController {
  async index(req, res) {
    const { id } = req.params;
    const { delivered } = req.query;

    const deliveryman = await Delivery.findByPk(id);

    if(!deliveryman) {
      return res.status(400).json({ error:"Entregador Inexistente" });
    }

    /**
     * Criando lista de orders que não tenham sido canceladas
     * nem entregues
     */

    if(delivered === 'false') {
      const orders = await Order.findAndCountAll({
        where: { deliveryman: id, end_date: null, canceled_at: null},
        include: [
          {
            model: File,
            as: 'Signature',
            attributes: ['name', 'path', 'url'],
          },
          {
            model: Recipient,
            as: 'recipient',
          },
          {
            model: Delivery,
            as: 'deliveryman',
            attributes: ['name', 'name'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes:['id', 'path', 'url'],
            },
          ],
          },
        ],
      });

      return res.json(orders);;
    }
  }
  
  async update(req, res) {
    const orders = await Order.findAndCountAll({
      where: {
        deliveryman_id: id,
        [Op.or]: [
          {end_date: { [Op.ne]: null}},
          {canceled_at: { [Op.ne]: null}},
        ],
      },
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
        {
          model: Recipient,
          as: 'recipient',
        },
        {
          model: Delivery,
          as: 'deliveryman',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],

      order: [['id', 'ASC']],
      limit: 5,
    });

    return res.json(orders);
  }

  async update(req, res) {
    const { id, orderId } = req.params;
    const { endDelivery } = req.query;

    const deliveryman = await Delivery.findByPk(id);
    const order = await Order.findByPk(orderId);

    if(!deliveryman) {
      return res.status(400).json({ error: 'Entregador Inexistente' });
    }

    if(!order) {
      return res.status(400).json({ error: 'Encomenda Inexistente' });
    }

    const date = new Date();

    const ordersByDay = await Order.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if(endDelivery === 'false' && ordersByDay.length > 5) {
      return res.status(400).json({ error: 'Somente 5 (cinco) retiradas ao dia'});
    }

    await order.update(req.body);

    const {
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date
    } = await Order.findByPk(orderId);

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });

  }
}

export default new DeliveryManOrderController();