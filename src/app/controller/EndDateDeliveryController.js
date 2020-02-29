import Order from '../models/Order';
import File from '../models/File';

import { Op } from 'sequelize';

class EndDateDeliveryController {
  async update(req, res) {
    const { delivery_id, deliveryman_id } = req.params;

    const order = await Order.findOne({
      where: {
        id: delivery_id,
        deliveryman_id: deliveryman_id,
        canceled_at: null,
        start_date: {[Op.ne]: null},
        end_date: null,
      },
    });

    if(! order) {
      return res.status(400).json({ 
        error: 'Delivery not exist or has finishe'
      });
    };
    
    let newFile = null;

    if(req.file) {
      const { filename: path, originalname: name} = req.file;
      newFile = await File.create({
        path,
        name,
      });
    }

    const DeliveryHasFinished = await order.update({
      signature_id: newFile ? newFile.id : null,
      end_date: new Date(),
    });

    return res.json(DeliveryHasFinished);
  }

}

export default new EndDateDeliveryController();