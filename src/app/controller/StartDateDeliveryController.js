import Order from '../models/Order';

import { setHours, 
         setMinutes, 
         setSeconds,
         isBefore,
         isAfter,
        } from 'date-fns';

class StartDateDeliveryController {
  async update(req, res) {
  const { delivery_id, deliveryman_id } = req.params;

  const order = await Order.findOne({
    where: {
      id: delivery_id,
      deliveryman_id: deliveryman_id,
      canceled_at: null,
      start_date: null,
      end_date:null,
    },
    attributes: [
      'id',
      'product',
      'canceled_at',
      'recipient_id',
      'deliveryman_id',
      'signature_id',
    ],
  });

  if(! order) {
    return res.status(400).json({ 
      error: 'Order does not exist or has started'
    });
  }

  const date = new Date();

  const startShift = setSeconds(setMinutes(setHours(date, 8), 0), 0);
  const endShift = setSeconds(setMinutes(setHours(date, 18), 0), 0);
   
  if(isBefore(date, startShift) && isAfter(date, endShift)) {
    return res.status(400).json({
      error: "You can not get your order off the office hours"
    });
  }

  const deliveryReadyToDispatch = await order.update({
    start_date: new Date(),
  });

  return res.json(deliveryReadyToDispatch);
  }  
}

export default new StartDateDeliveryController();