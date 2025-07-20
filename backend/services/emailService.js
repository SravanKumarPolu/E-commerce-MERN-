import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Create reusable transporter object using SMTP transport
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(email, resetToken, resetUrl) {
    try {
      const mailOptions = {
        from: `"${process.env.APP_NAME || 'E-commerce Store'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: this.generatePasswordResetTemplate(resetToken, resetUrl),
        text: this.generatePasswordResetText(resetToken, resetUrl),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  generatePasswordResetTemplate(resetToken, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>You requested to reset your password</p>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>We received a request to reset your password for your account. If you didn't make this request, you can safely ignore this email.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}?token=${resetToken}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${resetUrl}?token=${resetToken}
            </p>
            
            <p>Best regards,<br>The ${process.env.APP_NAME || 'E-commerce Store'} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'E-commerce Store'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generatePasswordResetText(resetToken, resetUrl) {
    return `
Password Reset Request

Hello!

We received a request to reset your password for your account. If you didn't make this request, you can safely ignore this email.

To reset your password, click the following link:
${resetUrl}?token=${resetToken}

Security Notice:
- This link will expire in 1 hour
- If you didn't request this, please ignore this email
- Never share this link with anyone

Best regards,
The ${process.env.APP_NAME || 'E-commerce Store'} Team

This is an automated email. Please do not reply to this message.
    `;
  }

  async sendWelcomeEmail(email, name) {
    try {
      const mailOptions = {
        from: `"${process.env.APP_NAME || 'E-commerce Store'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Welcome to Our Store!',
        html: this.generateWelcomeTemplate(name),
        text: this.generateWelcomeText(name),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  generateWelcomeTemplate(name) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Store!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Our Store!</h1>
            <p>We're excited to have you on board</p>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for creating an account with us. We're thrilled to have you as part of our community!</p>
            
            <p>Here's what you can do with your new account:</p>
            <ul>
              <li>Browse our extensive product catalog</li>
              <li>Save items to your wishlist</li>
              <li>Track your orders</li>
              <li>Manage your profile and addresses</li>
              <li>Receive exclusive offers and updates</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Start Shopping</a>
            </div>
            
            <p>If you have any questions or need assistance, don't hesitate to contact our support team.</p>
            
            <p>Happy shopping!<br>The ${process.env.APP_NAME || 'E-commerce Store'} Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'E-commerce Store'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateWelcomeText(name) {
    return `
Welcome to Our Store!

Hello ${name}!

Thank you for creating an account with us. We're thrilled to have you as part of our community!

Here's what you can do with your new account:
- Browse our extensive product catalog
- Save items to your wishlist
- Track your orders
- Manage your profile and addresses
- Receive exclusive offers and updates

Start shopping now: ${process.env.FRONTEND_URL || 'http://localhost:3000'}

If you have any questions or need assistance, don't hesitate to contact our support team.

Happy shopping!
The ${process.env.APP_NAME || 'E-commerce Store'} Team
    `;
  }
}

export default new EmailService(); 