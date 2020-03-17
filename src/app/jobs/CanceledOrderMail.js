import Mail from '../../lib/Mail';

class CanceledOrderMail {
  get key() {
    return 'CanceledOrderMail';
  }

  async handle({ data }) {
    const { order, deliveryProblem } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${order.deliverys.name} <${order.deliverys.email}>`,
      subject: 'Uma entrega foi cancelada',
      template: 'canceledOrder',
      context: {
        name: order.deliveryman.name,
        recipient: order.recipients.name,
        product: order.product,
        description: deliveryProblem.description,
      }
    });
  }
}

export default new CanceledOrderMail();