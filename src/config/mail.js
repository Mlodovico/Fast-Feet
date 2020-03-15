require('dotenv/config');

export default {
  host: smtp.mailtrap.io,
  port: 2525,
  secure: false,
  auth: {
    user: '8c964713740c78',
    pass: 'bc4a1aee7b9ba6',
  },
  default: {
    from: 'Team FastFeet <noreply@fastfeet.com>',
  },
};