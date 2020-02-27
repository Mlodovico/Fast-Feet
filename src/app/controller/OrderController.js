import Order from '../models/Order';

class OrderController {
  async store(req, res) {

    return res.json({ ok: true });
  }

  async index(req, res) {

    return res.json({ ok: true });
  }
  
  async update(req, res) {
    return res.json({ ok: true });
  }


  async delete(req, res) {
    return res.json({ ok: true });
  }
}

export default  new OrderController();