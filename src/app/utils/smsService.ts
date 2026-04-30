import config from '../../config';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SMS SERVICE - BulkSMSBD Integration
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Uses BulkSMSBD API for sending SMS in Bangladesh
 * API: http://bulksmsbd.net/api
 */

// SMS Templates (Bengali)
export const SMS_TEMPLATES = {
  // Guest password SMS
  GUEST_PASSWORD: (phone: string, password: string) => 
    `CADDCORE: আপনার অ্যাকাউন্ট তৈরি হয়েছে।\nফোন: ${phone}\nপাসওয়ার্ড: ${password}\nলগইন: caddcore.com/login`,

  // Order confirmation SMS
  ORDER_CONFIRM: (orderNumber: string, total: number) => 
    `CADDCORE: আপনার অর্ডার #${orderNumber} নিশ্চিত হয়েছে।\nমোট: ৳${total}\nধন্যবাদ!`,

  // Order shipped SMS
  ORDER_SHIPPED: (orderNumber: string) => 
    `CADDCORE: আপনার অর্ডার #${orderNumber} ডেলিভারির জন্য পাঠানো হয়েছে।`,

  // Order delivered SMS
  ORDER_DELIVERED: (orderNumber: string) => 
    `CADDCORE: আপনার অর্ডার #${orderNumber} সফলভাবে ডেলিভারি হয়েছে। ধন্যবাদ!`,

  // OTP SMS
  OTP: (otp: string) => 
    `CADDCORE: আপনার ভেরিফিকেশন কোড হলো ${otp}। ৫ মিনিটের মধ্যে ব্যবহার করুন।`,
};

/**
 * Send SMS using BulkSMSBD API
 */
export const sendSMS = async (phone: string, message: string): Promise<boolean> => {
  try {
    const apiKey = config.bulk_sms_api_key;
    const senderId = config.bulk_sms_sender_id;
    const baseUrl = config.bulk_sms_base_url || 'http://bulksmsbd.net/api';

    if (!apiKey) {
      console.warn('⚠️ SMS: API key not configured, skipping SMS');
      return false;
    }

    // Format phone number (remove leading 0 or +88)
    let formattedPhone = phone.replace(/^\+?88/, '').replace(/^0/, '');
    formattedPhone = `88${formattedPhone}`; // Add country code

    const url = `${baseUrl}/smsapi`;
    const params = new URLSearchParams({
      api_key: apiKey,
      type: 'text',
      number: formattedPhone,
      senderid: senderId || '',
      message: message,
    });

    const response = await fetch(`${url}?${params.toString()}`);
    const result = await response.json() as { response_code?: number };

    if (result.response_code === 202) {
      console.log(`✅ SMS sent to ${phone}`);
      return true;
    } else {
      console.error(`❌ SMS failed:`, result);
      return false;
    }
  } catch (error) {
    console.error('❌ SMS Error:', error);
    return false;
  }
};

/**
 * Send Guest Password SMS
 */
export const sendGuestPasswordSMS = async (phone: string, password: string): Promise<boolean> => {
  const message = SMS_TEMPLATES.GUEST_PASSWORD(phone, password);
  return sendSMS(phone, message);
};

/**
 * Send Order Confirmation SMS
 */
export const sendOrderConfirmationSMS = async (phone: string, orderNumber: string, total: number): Promise<boolean> => {
  const message = SMS_TEMPLATES.ORDER_CONFIRM(orderNumber, total);
  return sendSMS(phone, message);
};

/**
 * Send Order Status Update SMS
 */
export const sendOrderStatusSMS = async (phone: string, orderNumber: string, status: 'SHIPPED' | 'DELIVERED'): Promise<boolean> => {
  const message = status === 'SHIPPED' 
    ? SMS_TEMPLATES.ORDER_SHIPPED(orderNumber)
    : SMS_TEMPLATES.ORDER_DELIVERED(orderNumber);
  return sendSMS(phone, message);
};
