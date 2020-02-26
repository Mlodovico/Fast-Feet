import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res){
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if(!user){
      return res.status(401).json({ error: 'User not found' });
    }
    
    const { id, name, password_hash } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        password_hash,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController;
