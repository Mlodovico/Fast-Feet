import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import CanceledOrderMail from '../jobs/CanceledOrderMail';

import Queue from '../../lib/Queue';

import * as Yup from 'yup';

class DeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;

    if(id) {
      const selectedDeliveryProblem = await DeliveryProblem.findAll({
        where: {
          delivery_id: id
        },
        attributes: [ 'id', 'description'],
      });

      return res.json(selectedDeliveryProblem);
    }

    const AllDeliveryProblems = await DeliveryProblem.findAll({
      include: [
        {
          model: Order,
          as: 'delivery',
          attributes: [
            'id',
            'product',
            'start_date',
            'end_date',
            'canceled_at',
          ],
        },
      ],
    });

    return res.json(AllDeliveryProblems);
}


  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Error"});
    }

    const { deliveryId }  = req.params;
    const { description } = req.body;

    const createDeliveryProblems = await DeliveryProblem.create({
        delivery_id: deliveryId,
        description,
      }
    );

    return res.json(createDeliveryProblems);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryProblem = await DeliveryProblem.findByPk(id);

    if(! deliveryProblem) {
      return res.status(400).json({ error: "This delivery id problem does not exist"});
    }

    const { delivery_id } = deliveryProblem;

    const order = await Order.findByPk(delivery_id, {
      include: [
        {
          model: Delivery,
          as: 'deliveryman',
          attributes: [ 'name' ],
        },
        {
          model: Recipient,
          as: 'recipients',
          attributes: [ 'name' ],
        },
      ],
    });

    if(!order) {
      return res.status(400).json({ error: "This order does not exist"});
    };

    if(order.canceled_at === null) {
      return res.status(400).json({ error: "This order has been canceled"});
    };

    if(order.end_date !== null) {
      return res.status(400).json({error: "This order has been delivered"});
    };

    const {
      product,
      canceled_at,
      recipient_id,
      deliveryman_id,
    } = await order.update({
      ...req.body,
      canceled_at: new Date(),
    });

    /**
     * Não está retornando o destinatário(recipient.name) pq?
     */

    await Queue.add(CanceledOrderMail.key, {
      order,
      deliveryProblem,
    });

    return res.json({
      delivery_id,
      product,
      canceled_at,
      recipient_id,
      deliveryman_id,
    });
  }
  
}

export default new DeliveryProblemController();