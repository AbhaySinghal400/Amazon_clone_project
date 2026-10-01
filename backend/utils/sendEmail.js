const nodemailer = require('nodemailer');

// Spring Boot analogy: JavaMailSender configuration and send method
const sendEmail = async (options) => {
  try {
    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT || '2525'),
      auth: {
        user: process.env.SMTP_USER || 'test_user',
        pass: process.env.SMTP_PASS || 'test_pass'
      }
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Amazon Marketplace'}" <${process.env.FROM_EMAIL || 'noreply@amazonmarketplace.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.warn('Nodemailer failed to send email. Falling back to Console logging:');
    console.log('--- EMAIL SIMULATOR ---');
    console.log(`TO: ${options.email}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log(`BODY: ${options.message}`);
    console.log('-----------------------');
    // We return a mock info response so the request doesn't crash
    return { messageId: 'simulated-id-12345' };
  }
};

module.exports = sendEmail;
