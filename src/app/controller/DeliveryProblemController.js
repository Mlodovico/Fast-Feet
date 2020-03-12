import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
//import Delivery from '../models/Delivery';
//import Recipient from '../models/Recipient';

import * as Yup from 'yup';

class DeliveryProblemController {
  async index(req, res) {
    const deliveryProblems = await DeliveryProblem.findAll(
      console.log('Check index delivery problems routes'),
      {
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
      }
    );

    return res.json(deliveryProblems);
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

    return res.json(
      console.log("Success"), createDeliveryProblems);
  }
}

export default new DeliveryProblemController();