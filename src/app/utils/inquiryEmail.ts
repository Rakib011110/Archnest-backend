import nodemailer from 'nodemailer';
import config from '../../config';

// ─────────────────────────────────────────────────────────────────────────────
// TRANSPORTER
// ─────────────────────────────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    host: config.email_host,
    port: Number(config.email_port),
    secure: false,
    auth: { user: config.email_user, pass: config.email_pass },
  });

// ─────────────────────────────────────────────────────────────────────────────
// BASE WRAPPER — Shared layout for all emails
// ─────────────────────────────────────────────────────────────────────────────
const baseWrapper = (body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    /* Reset */
    body, table, td, p { margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; -webkit-font-smoothing: antialiased; }
    img { border: 0; display: block; }

    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #111111; padding: 32px 40px; }
    .header-brand { font-size: 11px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: #999999; margin-bottom: 4px; }
    .header-title { font-size: 22px; font-weight: 600; color: #ffffff; line-height: 1.3; }

    .body-content { padding: 36px 40px; color: #374151; font-size: 14px; line-height: 1.7; }
    .greeting { font-size: 16px; font-weight: 600; color: #111111; margin-bottom: 12px; }
    .body-text { color: #6b7280; margin-bottom: 20px; }

    .detail-card { background-color: #fafafa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 24px 0; }
    .detail-row { margin-bottom: 16px; }
    .detail-row:last-child { margin-bottom: 0; }
    .detail-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #9ca3af; margin-bottom: 4px; }
    .detail-value { font-size: 14px; color: #111827; font-weight: 500; }

    .divider { height: 1px; background-color: #f3f4f6; margin: 24px 0; }

    .footer { padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #f3f4f6; text-align: center; }
    .footer-text { font-size: 11px; color: #9ca3af; line-height: 1.6; }
    .footer-brand { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #d1d5db; margin-top: 8px; }
  </style>
</head>
<body style="background-color: #f4f4f5; padding: 40px 20px;">
  <div class="email-container" style="border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
    ${body}
    <div class="footer">
      <p class="footer-text">This is an automated message from ArchNest Studio.</p>
      <p class="footer-brand">ARCHNEST STUDIO</p>
    </div>
  </div>
</body>
</html>
`;

// ─────────────────────────────────────────────────────────────────────────────
// INQUIRY — Client Confirmation
// ─────────────────────────────────────────────────────────────────────────────
const inquiryClientTemplate = (data: InquiryEmailData) => baseWrapper(`
  <div class="header">
    <p class="header-brand">ArchNest Studio</p>
    <p class="header-title">We received your inquiry</p>
  </div>
  <div class="body-content">
    <p class="greeting">Hello ${data.name},</p>
    <p class="body-text">Thank you for reaching out. We have received your project inquiry and our team will review it carefully. You can expect to hear from us within 24 hours.</p>

    <div class="detail-card">
      <div class="detail-row">
        <p class="detail-label">Name</p>
        <p class="detail-value">${data.name}</p>
      </div>
      <div class="detail-row">
        <p class="detail-label">Email</p>
        <p class="detail-value">${data.email}</p>
      </div>
      ${data.phone ? `<div class="detail-row"><p class="detail-label">Phone</p><p class="detail-value">${data.phone}</p></div>` : ''}
      ${data.projectType ? `<div class="detail-row"><p class="detail-label">Project Type</p><p class="detail-value">${data.projectType}</p></div>` : ''}
      <div class="detail-row">
        <p class="detail-label">Message</p>
        <p class="detail-value" style="white-space: pre-line;">${data.message}</p>
      </div>
    </div>

    <p class="body-text">If you have any additional information to share, feel free to reply to this email.</p>
    <p style="color: #111827; font-weight: 500;">Best regards,<br/>ArchNest Studio</p>
  </div>
`);

// ─────────────────────────────────────────────────────────────────────────────
// INQUIRY — Admin Notification
// ─────────────────────────────────────────────────────────────────────────────
const inquiryAdminTemplate = (data: InquiryEmailData) => baseWrapper(`
  <div class="header">
    <p class="header-brand">Admin Notification</p>
    <p class="header-title">New Project Inquiry</p>
  </div>
  <div class="body-content">
    <p class="greeting">New inquiry received</p>
    <p class="body-text">A visitor has submitted a project inquiry through the website contact form. Details are below.</p>

    <div class="detail-card">
      <div class="detail-row">
        <p class="detail-label">Full Name</p>
        <p class="detail-value">${data.name}</p>
      </div>
      <div class="detail-row">
        <p class="detail-label">Email Address</p>
        <p class="detail-value"><a href="mailto:${data.email}" style="color: #111827; text-decoration: underline;">${data.email}</a></p>
      </div>
      ${data.phone ? `<div class="detail-row"><p class="detail-label">Phone</p><p class="detail-value">${data.phone}</p></div>` : ''}
      ${data.projectType ? `<div class="detail-row"><p class="detail-label">Project Type</p><p class="detail-value">${data.projectType}</p></div>` : ''}
      <div class="detail-row">
        <p class="detail-label">Message</p>
        <p class="detail-value" style="white-space: pre-line;">${data.message}</p>
      </div>
    </div>

    <p class="body-text">You can manage this inquiry from the admin dashboard.</p>
  </div>
`);

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING — Client Confirmation
// ─────────────────────────────────────────────────────────────────────────────
const bookingClientTemplate = (data: BookingEmailData) => baseWrapper(`
  <div class="header">
    <p class="header-brand">ArchNest Studio</p>
    <p class="header-title">Booking Received</p>
  </div>
  <div class="body-content">
    <p class="greeting">Hello ${data.clientName},</p>
    <p class="body-text">Your consultation request has been received. Our team will confirm your booking and follow up with meeting details shortly.</p>

    <div class="detail-card">
      <div class="detail-row">
        <p class="detail-label">Reference</p>
        <p class="detail-value">${data.reference}</p>
      </div>
      <div class="detail-row">
        <p class="detail-label">Date</p>
        <p class="detail-value">${data.dateLabel}</p>
      </div>
      <div class="detail-row">
        <p class="detail-label">Time</p>
        <p class="detail-value">${data.timeLabel} (${data.timezone})</p>
      </div>
      ${data.notes ? `<div class="detail-row"><p class="detail-label">Notes</p><p class="detail-value" style="white-space: pre-line;">${data.notes}</p></div>` : ''}
    </div>

    <p class="body-text">If you need to reschedule, please reply to this email or contact our studio directly.</p>
    <p style="color: #111827; font-weight: 500;">Best regards,<br/>ArchNest Studio</p>
  </div>
`);

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING — Admin Notification
// ─────────────────────────────────────────────────────────────────────────────
const bookingAdminTemplate = (data: BookingEmailData) => baseWrapper(`
  <div class="header">
    <p class="header-brand">Admin Notification</p>
    <p class="header-title">New Booking Request</p>
  </div>
  <div class="body-content">
    <p class="greeting">New consultation booking</p>
    <p class="body-text">A visitor has booked a consultation slot through the website. Please review and confirm.</p>

    <div class="detail-card">
      <div class="detail-row">
        <p class="detail-label">Client Name</p>
        <p class="detail-value">${data.clientName}</p>
      </div>
      <div class="detail-row">
        <p class="detail-label">Email</p>
        <p class="detail-value"><a href="mailto:${data.clientEmail}" style="color: #111827; text-decoration: underline;">${data.clientEmail}</a></p>
      </div>
      ${data.clientPhone ? `<div class="detail-row"><p class="detail-label">Phone</p><p class="detail-value">${data.clientPhone}</p></div>` : ''}
      <div class="detail-row">
        <p class="detail-label">Reference</p>
        <p class="detail-value">${data.reference}</p>
      </div>
      <div class="detail-row">
        <p class="detail-label">Requested Date</p>
        <p class="detail-value">${data.dateLabel}</p>
      </div>
      <div class="detail-row">
        <p class="detail-label">Requested Time</p>
        <p class="detail-value">${data.timeLabel} (${data.timezone})</p>
      </div>
      ${data.notes ? `<div class="detail-row"><p class="detail-label">Notes</p><p class="detail-value" style="white-space: pre-line;">${data.notes}</p></div>` : ''}
    </div>

    <p class="body-text">Manage this booking from the admin dashboard.</p>
  </div>
`);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface InquiryEmailData {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  message: string;
}

export interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  reference: string;
  dateLabel: string;
  timeLabel: string;
  timezone: string;
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEND FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send inquiry emails — confirmation to client + notification to admin.
 * Runs both in parallel; failures are logged but never throw.
 */
export const sendInquiryEmails = async (
  clientEmail: string,
  adminEmail: string,
  data: InquiryEmailData
): Promise<void> => {
  try {
    const transporter = createTransporter();
    const results = await Promise.allSettled([
      transporter.sendMail({
        from: `"ArchNest Studio" <${config.email_from}>`,
        to: clientEmail,
        subject: `We received your inquiry — ArchNest Studio`,
        html: inquiryClientTemplate(data),
      }),
      transporter.sendMail({
        from: `"ArchNest Studio" <${config.email_from}>`,
        to: adminEmail,
        subject: `New Inquiry from ${data.name}`,
        html: inquiryAdminTemplate(data),
      }),
    ]);

    results.forEach((r, i) => {
      const target = i === 0 ? `client (${clientEmail})` : `admin (${adminEmail})`;
      if (r.status === 'fulfilled') console.log(`✅ Inquiry email sent to ${target}`);
      else console.error(`❌ Inquiry email failed for ${target}:`, r.reason);
    });
  } catch (error) {
    console.error('❌ Inquiry email transporter error:', error);
  }
};

/**
 * Send booking emails — confirmation to client + notification to admin.
 * Runs both in parallel; failures are logged but never throw.
 */
export const sendBookingEmails = async (
  clientEmail: string,
  adminEmail: string,
  data: BookingEmailData
): Promise<void> => {
  try {
    const transporter = createTransporter();
    const results = await Promise.allSettled([
      transporter.sendMail({
        from: `"ArchNest Studio" <${config.email_from}>`,
        to: clientEmail,
        subject: `Booking Received — ${data.reference} | ArchNest Studio`,
        html: bookingClientTemplate(data),
      }),
      transporter.sendMail({
        from: `"ArchNest Studio" <${config.email_from}>`,
        to: adminEmail,
        subject: `New Booking from ${data.clientName} — ${data.reference}`,
        html: bookingAdminTemplate(data),
      }),
    ]);

    results.forEach((r, i) => {
      const target = i === 0 ? `client (${clientEmail})` : `admin (${adminEmail})`;
      if (r.status === 'fulfilled') console.log(`✅ Booking email sent to ${target}`);
      else console.error(`❌ Booking email failed for ${target}:`, r.reason);
    });
  } catch (error) {
    console.error('❌ Booking email transporter error:', error);
  }
};
