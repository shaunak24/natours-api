const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // init transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // specify options
  const mailOptions = {
    from: 'Shaunak <shaunak.12.24@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
