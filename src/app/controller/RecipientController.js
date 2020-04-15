import Recipient from '../models/Recipient';
import User from '../models/User';

import * as Yup from 'yup';

class ControllerRecipients {
  async index(req, res) {
    const recipients = await Recipient.findAll({
      attributes: [ 'id',
                    'name',
                    'street', 
                    'number', 
                    'complement', 
                    'state', 
                    'city', 
                    'postal_code' ]
    });

    return res.json(recipients);
  }

  async store(req, res){
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      postal_code: Yup.number().required(),
    });

    if(! (await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation error' });
    };

    const checkIsAdministrator = await User.findOne({
      where: { id: req.userId, administrator: true }
    });

    if(!checkIsAdministrator){
      return res.status(401).json({ 
        error: 'Normally users can not create recipients'
      });
    }

    const { name, street, number, complement, state, city, postal_code } = 
    await Recipient.create(req.body);
    
    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      postal_code,
     });

  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string().required(),
      postalCode: Yup.number().required().min(9),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({ error: 'Validation error'});
    };

    const checkIsAdministrator = await User.findOne({
      where: { id: req.userId, administrator: true }
    });

    if(!checkIsAdministrator){
      return res.status(401).json({ 
        error: 'Normally users can not update recipients'
      });
    }

    const recipient = await Recipient.findByPk(req.userId)

    const { id, name, street, number, city, state } =
     await recipient.update(req.body);

     return res.json({
       id,
       name,
       street,
       number,
       city,
       state
     })
  }
}

export default new ControllerRecipients();