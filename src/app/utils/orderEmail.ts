import nodemailer from 'nodemailer';
import config from '../../config';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ORDER EMAIL TEMPLATES
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.email_host,
    port: Number(config.email_port),
    secure: false,
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  });
};

// HTML Email Template
const orderEmailTemplate = (data: {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  subTotal: number;
  shippingCost: number;
  grandTotal: number;
  shippingAddress: string;
  isNewUser?: boolean;
  generatedPassword?: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .order-id { font-size: 24px; font-weight: bold; color: #1a1a1a; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th, .items-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    .items-table th { background: #1a1a1a; color: white; }
    .total-row { font-weight: bold; background: #f0f0f0; }
    .new-account { background: #e8f5e9; border: 1px solid #4caf50; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .password-box { background: #fff3e0; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 18px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>ArchNest Studio</h1>
    <p>Project Inquiry Confirmation</p>
  </div>
  
  <div class="content">
    <p>Dear ${data.customerName},</p>
    <p>We have received your inquiry. Thank you for reaching out to ArchNest Studio!</p>
    
    <p class="order-id">Inquiry Number: ${data.orderNumber}</p>
    
    ${data.isNewUser ? `
    <div class="new-account">
      <h3>🆕 Account Created!</h3>
      <p>An account has been created for you. You can login with the following password to track your inquiry:</p>
      <div class="password-box">${data.generatedPassword}</div>
      <p><small>⚠️ For security, please change your password after logging in.</small></p>
    </div>
    ` : ''}
    
    <h3>📋 Details</h3>
    <table class="items-table">
      <tr>
        <th>Service/Item</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
      ${data.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>৳${item.price}</td>
        </tr>
      `).join('')}
      <tr>
        <td colspan="2">Subtotal</td>
        <td>৳${data.subTotal}</td>
      </tr>
      <tr class="total-row">
        <td colspan="2">Total</td>
        <td>৳${data.grandTotal}</td>
      </tr>
    </table>
    
    <p>Our team will contact you shortly.</p>
  </div>
  
  <div class="footer">
    <p>ArchNest Studio - Design Excellence</p>
    <p>Contact: support@archnest.studio</p>
  </div>
</body>
</html>
`;

/**
 * Send Inquiry Confirmation Email
 */
export const sendOrderConfirmationEmail = async (
  email: string,
  data: {
    orderNumber: string;
    customerName: string;
    items: { name: string; quantity: number; price: number }[];
    subTotal: number;
    shippingCost: number;
    grandTotal: number;
    shippingAddress: string;
    isNewUser?: boolean;
    generatedPassword?: string;
  }
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"ArchNest Studio" <${config.email_from}>`,
      to: email,
      subject: `✅ Inquiry Confirmed - ${data.orderNumber} | ArchNest Studio`,
      html: orderEmailTemplate(data),
    });

    console.log(`✅ Inquiry email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email Error:', error);
    return false;
  }
};

/**
 * Send Welcome Email
 */
export const sendGuestWelcomeEmail = async (
  email: string,
  name: string,
  password: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"ArchNest Studio" <${config.email_from}>`,
      to: email,
      subject: `🎉 Welcome to ArchNest Studio! Your account is ready`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a1a1a;">🎉 Welcome, ${name}!</h2>
          <p>Your ArchNest Studio account has been created successfully.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> <code style="background: #fff3e0; padding: 5px 10px; border-radius: 3px;">${password}</code></p>
          </div>
          <p>⚠️ For security, please change your password after logging in.</p>
          <a href="${config.client_url}/login" style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Login Now</a>
        </div>
      `,
    });

    console.log(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email Error:', error);
    return false;
  }
};
