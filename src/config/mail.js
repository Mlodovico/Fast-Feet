require('dotenv/config');

export default {
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: 'c0ca6560b59fb7',
    pass: '18f7ffbe0d543d',
  },
  default: {
    from: 'Team FastFeet <noreply@fastfeet.com>',
  },
};