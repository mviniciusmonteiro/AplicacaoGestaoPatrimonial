const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
  service: 'hotmail',
  secure: false,
  auth: {
    user: process.env.SUPER_EMAIL,
    pass: process.env.SUPER_EMAIL_PWD
  }
});