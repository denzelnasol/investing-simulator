const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post('/send', async (req, res) => {
  try {
    const emails = req.body.emails.join(', ');


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails,
      subject: "Competition Link",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).send('Links sent');
  } catch (e) {
    console.log(e);
    res.status(404).send('Link sending failed');
  }
});

module.exports = router;