const nodemailer = require("nodemailer");

const sendEmail = async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Hey 👻" <zechariahhounwanou@gmail.com>', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.html, // html body
  });
};
// obxd dejz irio psbs

module.exports = sendEmail;
