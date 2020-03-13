import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

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
    const deliveryProblem = await DeliveryProblem.findByPk(req.params.id);

    if(! deliveryProblem) {
      return res.status(400).json({ error: "This delivery id problem does not exist"});
    }

    await deliveryProblem.destroy();
    return res.status(200).json({ success: "The delivery problem has beem deleted"})
  }
}

export default new DeliveryProblemController();