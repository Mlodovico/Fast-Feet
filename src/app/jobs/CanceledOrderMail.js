import Mail from '../../config/mail';

class CanceledOrderMail {
  get key() {
    return 'CanceledOrderMail';
  }

  async handle({ data }) {
    const { order, deliveryProblem } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${order.delivery.name} <${order.delivery.email}>`,
      subject: 'Uma entrega foi cancelada',
      template: 'canceledOrder',
      context: {
        name: order.deliveryman.name,
        recipient: order.recipient.name,
        product: order.product,
        description: deliveryProblem.description,
      }
    });
  }
}

export default new CanceledOrderMail();