import nodemailer from 'nodemailer';
import config from '../../config';

const createTransporter = () =>
  nodemailer.createTransport({
    host: config.email_host,
    port: Number(config.email_port),
    secure: false,
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  });

const bookingConfirmationTemplate = (data: {
  clientName: string;
  reference: string;
  dateLabel: string;
  timeLabel: string;
  timezone: string;
  notes?: string;
  meetingType?: 'OFFICE' | 'ONLINE';
  meetingLocation?: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
    .header { background: #0d0d0d; color: #ffffff; padding: 24px 30px; }
    .header h1 { margin: 0; font-size: 22px; }
    .content { padding: 30px; color: #1a1a1a; }
    .meta { background: #f7f4ee; padding: 16px; border-radius: 10px; margin: 20px 0; }
    .meta p { margin: 6px 0; font-size: 14px; }
    .label { font-weight: bold; color: #7a8b6f; text-transform: uppercase; font-size: 11px; letter-spacing: 0.2em; }
    .footer { padding: 20px 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Booking Confirmed</h1>
      <p>ArchNest Studio Consultation</p>
    </div>
    <div class="content">
      <p>Hi ${data.clientName},</p>
      <p>Your consultation booking has been confirmed. We have reserved the time below.</p>
      <div class="meta">
        <p><span class="label">Reference</span><br />${data.reference}</p>
        <p><span class="label">Date</span><br />${data.dateLabel}</p>
        <p><span class="label">Time</span><br />${data.timeLabel} (${data.timezone})</p>
        ${data.meetingLocation ? `<p><span class="label">${data.meetingType === 'ONLINE' ? 'Meeting link' : 'Meeting location'}</span><br />${data.meetingLocation}</p>` : ''}
        ${data.notes ? `<p><span class="label">Notes</span><br />${data.notes}</p>` : ''}
      </div>
      <p>We will follow up shortly with the meeting location or online link.</p>
    </div>
    <div class="footer">
      If you need to reschedule, reply to this email or contact our studio.
    </div>
  </div>
</body>
</html>
`;

export const sendBookingConfirmationEmail = async (
  email: string,
  data: {
    clientName: string;
    reference: string;
    dateLabel: string;
    timeLabel: string;
    timezone: string;
    notes?: string;
    meetingType?: 'OFFICE' | 'ONLINE';
    meetingLocation?: string;
  }
): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"ArchNest Studio" <${config.email_from}>`,
      to: email,
      subject: `Booking Confirmed - ${data.reference} | ArchNest Studio`,
      html: bookingConfirmationTemplate(data),
    });

    console.log(`Booking confirmation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Booking email error:', error);
    return false;
  }
};
