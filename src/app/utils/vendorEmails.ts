import nodemailer from 'nodemailer';
import config from '../../config';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VENDOR EMAIL TEMPLATES - Notifications for Vendors
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

// Base email template wrapper
const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 10px 0 0; opacity: 0.8; }
    .content { padding: 30px; }
    .highlight-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .success-box { background: #e8f5e9; border-left-color: #4caf50; }
    .warning-box { background: #fff3e0; border-left-color: #ff9800; }
    .error-box { background: #ffebee; border-left-color: #f44336; }
    .btn { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 14px; }
    .approved { background: #e8f5e9; color: #2e7d32; }
    .rejected { background: #ffebee; color: #c62828; }
    .pending { background: #fff3e0; color: #ef6c00; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>CADDCORE - Vendor Marketplace</p>
      <p>যেকোনো প্রশ্নের জন্য: support@caddcore.com</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Send Vendor Approval Email
 */
export const sendVendorApprovalEmail = async (
  email: string,
  data: {
    vendorName: string;
    shopName: string;
  }
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const content = `
      <div class="header">
        <h1>🎉 অভিনন্দন!</h1>
        <p>আপনার ভেন্ডর আবেদন অনুমোদিত হয়েছে</p>
      </div>
      <div class="content">
        <p>প্রিয় ${data.vendorName},</p>
        <p>আমরা আনন্দের সাথে জানাচ্ছি যে <strong>${data.shopName}</strong> ভেন্ডর হিসেবে অনুমোদিত হয়েছে!</p>
        
        <div class="highlight-box success-box">
          <p><strong>✅ আপনার স্ট্যাটাস:</strong> <span class="status-badge approved">ACTIVE</span></p>
        </div>
        
        <p>এখন আপনি যা করতে পারবেন:</p>
        <ul>
          <li>📦 প্রোডাক্ট যোগ করুন</li>
          <li>📊 অর্ডার ম্যানেজ করুন</li>
          <li>💰 আয় ট্র্যাক করুন</li>
        </ul>
        
        <a href="${config.client_url}/vendor" class="btn">ড্যাশবোর্ডে যান →</a>
      </div>
    `;

    await transporter.sendMail({
      from: `"CADDCORE" <${config.email_from}>`,
      to: email,
      subject: `✅ ভেন্ডর অনুমোদিত - ${data.shopName} | CADDCORE`,
      html: emailWrapper(content),
    });

    console.log(`✅ Vendor approval email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email Error:', error);
    return false;
  }
};

/**
 * Send Vendor Rejection Email
 */
export const sendVendorRejectionEmail = async (
  email: string,
  data: {
    vendorName: string;
    shopName: string;
    reason?: string;
  }
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const content = `
      <div class="header" style="background: linear-gradient(135deg, #424242 0%, #616161 100%);">
        <h1>📋 আবেদন আপডেট</h1>
        <p>আপনার ভেন্ডর আবেদন সম্পর্কে</p>
      </div>
      <div class="content">
        <p>প্রিয় ${data.vendorName},</p>
        <p>দুঃখিত, <strong>${data.shopName}</strong> এর ভেন্ডর আবেদন এই মুহূর্তে অনুমোদন করা সম্ভব হয়নি।</p>
        
        <div class="highlight-box error-box">
          <p><strong>স্ট্যাটাস:</strong> <span class="status-badge rejected">REJECTED</span></p>
          ${data.reason ? `<p><strong>কারণ:</strong> ${data.reason}</p>` : ''}
        </div>
        
        <p>আপনি আবার আবেদন করতে পারেন অথবা সাপোর্টে যোগাযোগ করতে পারেন।</p>
        
        <a href="${config.client_url}/become-a-vendor" class="btn">পুনরায় আবেদন করুন</a>
      </div>
    `;

    await transporter.sendMail({
      from: `"CADDCORE" <${config.email_from}>`,
      to: email,
      subject: `📋 ভেন্ডর আবেদন আপডেট - ${data.shopName} | CADDCORE`,
      html: emailWrapper(content),
    });

    console.log(`✅ Vendor rejection email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email Error:', error);
    return false;
  }
};

/**
 * Send Product Approval Email
 */
export const sendProductApprovalEmail = async (
  email: string,
  data: {
    vendorName: string;
    productName: string;
    productSlug: string;
  }
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const content = `
      <div class="header">
        <h1>✅ প্রোডাক্ট অনুমোদিত!</h1>
        <p>আপনার প্রোডাক্ট এখন লাইভ</p>
      </div>
      <div class="content">
        <p>প্রিয় ${data.vendorName},</p>
        <p>আপনার প্রোডাক্ট <strong>"${data.productName}"</strong> অনুমোদিত হয়েছে এবং এখন গ্রাহকদের কাছে দেখানো হচ্ছে!</p>
        
        <div class="highlight-box success-box">
          <p><strong>✅ স্ট্যাটাস:</strong> <span class="status-badge approved">ACTIVE</span></p>
        </div>
        
        <a href="${config.client_url}/product/${data.productSlug}" class="btn">প্রোডাক্ট দেখুন →</a>
      </div>
    `;

    await transporter.sendMail({
      from: `"CADDCORE" <${config.email_from}>`,
      to: email,
      subject: `✅ প্রোডাক্ট অনুমোদিত - ${data.productName} | CADDCORE`,
      html: emailWrapper(content),
    });

    console.log(`✅ Product approval email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email Error:', error);
    return false;
  }
};

/**
 * Send Product Rejection Email
 */
export const sendProductRejectionEmail = async (
  email: string,
  data: {
    vendorName: string;
    productName: string;
    reason?: string;
  }
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const content = `
      <div class="header" style="background: linear-gradient(135deg, #424242 0%, #616161 100%);">
        <h1>📋 প্রোডাক্ট রিভিউ</h1>
        <p>আপনার প্রোডাক্ট সম্পর্কে</p>
      </div>
      <div class="content">
        <p>প্রিয় ${data.vendorName},</p>
        <p>দুঃখিত, আপনার প্রোডাক্ট <strong>"${data.productName}"</strong> অনুমোদন করা সম্ভব হয়নি।</p>
        
        <div class="highlight-box error-box">
          <p><strong>স্ট্যাটাস:</strong> <span class="status-badge rejected">REJECTED</span></p>
          ${data.reason ? `<p><strong>কারণ:</strong> ${data.reason}</p>` : ''}
        </div>
        
        <p>অনুগ্রহ করে প্রোডাক্ট তথ্য সংশোধন করে পুনরায় সাবমিট করুন।</p>
        
        <a href="${config.client_url}/vendor/products" class="btn">প্রোডাক্ট সম্পাদনা করুন</a>
      </div>
    `;

    await transporter.sendMail({
      from: `"CADDCORE" <${config.email_from}>`,
      to: email,
      subject: `📋 প্রোডাক্ট রিভিউ - ${data.productName} | CADDCORE`,
      html: emailWrapper(content),
    });

    console.log(`✅ Product rejection email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email Error:', error);
    return false;
  }
};

/**
 * Send Withdrawal Processed Email
 */
export const sendWithdrawalProcessedEmail = async (
  email: string,
  data: {
    vendorName: string;
    amount: number;
    status: 'APPROVED' | 'REJECTED';
    transactionId?: string;
    reason?: string;
  }
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const isApproved = data.status === 'APPROVED';
    
    const content = `
      <div class="header" style="background: linear-gradient(135deg, ${isApproved ? '#2e7d32' : '#424242'} 0%, ${isApproved ? '#4caf50' : '#616161'} 100%);">
        <h1>${isApproved ? '💰' : '📋'} উইথড্র ${isApproved ? 'সফল' : 'আপডেট'}</h1>
        <p>আপনার উইথড্র রিকোয়েস্ট সম্পর্কে</p>
      </div>
      <div class="content">
        <p>প্রিয় ${data.vendorName},</p>
        
        ${isApproved ? `
          <p>আপনার <strong>৳${data.amount.toLocaleString()}</strong> উইথড্র রিকোয়েস্ট সফলভাবে প্রসেস করা হয়েছে!</p>
          
          <div class="highlight-box success-box">
            <p><strong>✅ স্ট্যাটাস:</strong> <span class="status-badge approved">APPROVED</span></p>
            <p><strong>পরিমাণ:</strong> ৳${data.amount.toLocaleString()}</p>
            ${data.transactionId ? `<p><strong>Transaction ID:</strong> ${data.transactionId}</p>` : ''}
          </div>
          
          <p>টাকা আপনার নির্ধারিত অ্যাকাউন্টে পাঠানো হয়েছে।</p>
        ` : `
          <p>দুঃখিত, আপনার <strong>৳${data.amount.toLocaleString()}</strong> উইথড্র রিকোয়েস্ট এই মুহূর্তে প্রসেস করা সম্ভব হয়নি।</p>
          
          <div class="highlight-box error-box">
            <p><strong>স্ট্যাটাস:</strong> <span class="status-badge rejected">REJECTED</span></p>
            ${data.reason ? `<p><strong>কারণ:</strong> ${data.reason}</p>` : ''}
          </div>
        `}
        
        <a href="${config.client_url}/vendor/earnings" class="btn">আয় দেখুন →</a>
      </div>
    `;

    await transporter.sendMail({
      from: `"CADDCORE" <${config.email_from}>`,
      to: email,
      subject: `${isApproved ? '💰' : '📋'} উইথড্র ${isApproved ? 'সফল' : 'আপডেট'} - ৳${data.amount.toLocaleString()} | CADDCORE`,
      html: emailWrapper(content),
    });

    console.log(`✅ Withdrawal email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email Error:', error);
    return false;
  }
};
