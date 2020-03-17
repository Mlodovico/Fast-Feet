import Order from '../models/Order';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import User from '../models/User';
import File from '../models/File';

import Queue from '../../lib/Queue';
import NewOrderMail from '../jobs/NewOrderMail';

import * as Yup from 'yup';
import { Op } from 'sequelize';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number(),
      product: Yup.string().required(),
    });

    if(! (await schema.isValid(req.body))){
      return res.status(400).json({ error: "Validation error"});
    }

    const { recipient_id } = req.body;

    /**
     * Check if recipient_id is a recipient
     */

    const isRecipient = await Recipient.findOne({
      where: { id: recipient_id }
    });

    if(!isRecipient) {
      return res.status(400).json({ 
        error: "This recipient id do not match with anyone"
      });
    }

    const { id, deliveryman_id, product } = await Order.create(req.body);

    const deliveryman = await Delivery.findByPk(deliveryman_id);

    if(!deliveryman) {
      return res.status(400).json({ 
        error: "This deliveryman id do not match with anyone"
      });
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Recipient,
          as: 'recipients',
          attributes: [
              'name',
              'street',
              'number',
              'complement',
              'state',
              'city',
              'postal_code',
          ],
        },
      ],
    });

    /**
     * Não está retornando o CEP(postal_code) pq?
     */

    await Queue.add(NewOrderMail.key, {
      deliveryman,
      product,
      order,
    })
   
    return res.json(order);
  }

  async index(req, res) {
    const orders = await Order.findAndCountAll({
      where: {
        product: { [Op.iLike]: `%${name}%`},
      },
      include: [{
        model:File,
        as: 'signature',
        attributes: [ 'name', 'path', 'url'],
      },
      {
        model: Recipient,
        as: 'recipients',
      },
      {
        model: Delivery,
        as: 'deliverys',
        attributes: [ 'id','name' ],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: [ 'id', 'path', 'url'],
          },
        ],
      },
     ],
    });

    return res.json(orders);

  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if(!order) {

      return res.status(400).json({ error: "Order does not exist" });
    }

    await order.destroy();
    return res.json({ success: 'The order has been deleted'});
  }
}

export default new OrderController();