import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'NewOrderMail';
  }

  async handle({ data }) {
    const { deliveryman, product, order } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Novo produto disponivel para retirada',
      template: 'newOrder',
      context: {
        deliveryman: deliveryman.name,
        product,
        recipient: order.recipients.name,
        street: order.recipients.street,
        number: order.recipients.number,
        complement: order.recipients.complement,
        state: order.recipients.state,
        city: order.recipients.city,
        postal_code: order.recipients.postal_code,
      },
    });
  }
}

export default new NewOrderMail();