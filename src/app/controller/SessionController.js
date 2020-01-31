import jwt from 'jsonwebtoken';

import User from '../models/User';

class SessionController {
  async store(req, res){
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if(!user){
      return res.status(401).json({ error: 'User not found' });
    }

    if(!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, 'd6f622d75899a8aefec0f9d3e30b1308', {
        expiresIn: '7d',
      }),
    });
  }
}

export default new SessionController;
