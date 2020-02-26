import User from '../models/User';

import * as Yup from 'yup';

class UserController  {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required(),
      administrator: Yup.boolean().default(false),
    });

    /**
     * Autentication for the required objects from the schema 
    **/

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation error'})
    }

    /**
     * Autentication by the email 
    **/

    const userExist =await User.findOne({ where: { email: req.body.email } });

    if(userExist){
      return res.status(400).json({ error: 'User Already exist'});
    }

    const { id, name, email, administrator } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      administrator,
    });
  }

  async update(req, res){
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
        ),
      administrator: Yup.boolean(),
    })

    if(!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation error' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    /**
     * Check after the usuability for the userExist validation
     */

    if(email && email !== user.email) {
      const userExist = await User.findOne({ where: { email }});

      if(userExist){
        return res.status(400).json({error: 'User already exist.'})
      }
    }

    if(oldPassword && !(await user.checkPassworld(oldPassword))){
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, administrator } = await user.update(req.body);

    return res.json({ 
      id,
      name,
      administrator,
    });
  }

}

export default new UserController();