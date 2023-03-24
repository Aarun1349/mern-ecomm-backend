const nodeMailer = require("nodemailer");

module.exports = sendEmail = async (options) => {
  const transport = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
    //   type: "OAuth2",
      user: process.env.SMTP_EMAIL_USER,
      pass: process.env.SMTP_PASSWORD,
    //   type: "OAuth2",
    //   user: "9e8b92e882634d",//process.env.SMTP_EMAIL_USER,
    //   pass: "6424bbd039e415",//process.env.SMTP_PASSWORD,
    },
  });
  console.log('=>',process.env.SMTP_EMAIL_USER,process.env.SMTP_PASSWORD)
  const message = {
    from: `${process.env.SMTP_FROM_NAME}<${process.env.SMTP_FROM_EMAIL}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(message);
};
