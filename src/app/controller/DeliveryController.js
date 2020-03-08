import Delivery from  '../models/Delivery';
import File from '../models/File';

import * as Yup from 'yup';

class DeliveryController {
  async store(req, res){
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      avatar_id: Yup.number(),
    });

    /**
     * Autentication for the required objects from the schema 
    **/

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    /**
     * Autentication by the email 
    **/

    const deliveryExist = await Delivery.findOne({ 
      where: { email: req.body.email }
    });

    if(deliveryExist) {
      return res.status(400).json({ error: 'Delivery already exist' });
    }

    const { id, name, email } = await Delivery.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const deliverys = await Delivery.findAll(
      console.log('Check index deliverys routes'),
      {
      attributes: [ 'id', 'name', 'email', 'avatar_id' ],
      include: [
         {
         model: File,
         as: 'avatar',
         attributes: [ 'name', 'path', 'url' ],
        }
      ]
    });

    return res.json(deliverys);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email(),
    avatar_id: Yup.number().required(),
    });

    console.log('check updated deliverys routes');

    if(!(schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation error' });
    }

    const { email } = req.body;

    const delivery = await Delivery.findByPk(req.params.id);
    
    if(email !== delivery.email) {
      const deliveryExist = await Delivery.findOne({ where: { email: req.email }});

      if(deliveryExist){
        return res.status(400).json({error: 'Delivery email already exist.'})
      }
    }

    const { id, name, avatar_id } = await delivery.update(req.body);

    return res.json({ 
      id,
      name,
      avatar_id, 
    });

  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    console.log('check delete route');

    if(! delivery) {
      return res.status(400).json({ error: "This delivery man does not exist"});
    }

    delivery.destroy(req.body);

    return res.json({ delete: true });
  }
}

export default new DeliveryController();