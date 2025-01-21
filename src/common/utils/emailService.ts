import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: 'racheltb123@gmail.com',
    pass: 'lxphgpfdzxgnsvsj',
  },
});

export default async function sendResetPasswordEmail(email: string, resetLink: string) {
  const mailOptions = {
    from: 'racheltb123@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset email sent!');
  } catch (error) {
    console.error('Error sending reset email: ', error);
  }
}
