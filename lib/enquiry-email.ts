import nodemailer from 'nodemailer';

type Enquiry = {
  id: string; name: string; email: string; phone: string; service: string;
  details: string; company: string; budget: string; timeline: string;
};
type EmailConfig = { EMAIL_PROVIDER?: string; SITE_URL?: string; REPLY_TO_EMAIL?: string; GMAIL_USER?: string; GMAIL_APP_PASSWORD?: string; RESEND_API_KEY?: string; EMAIL_FROM?: string; NOTIFICATION_EMAIL?: string };

export async function sendEnquiryEmails(enquiry: Enquiry, config: EmailConfig) {
  const provider = config.EMAIL_PROVIDER?.trim().toLowerCase() || 'auto';
  if (!['auto','gmail','resend'].includes(provider)) return {emailSent:false,notificationSent:false};
  const gmailReady = provider !== 'resend' && Boolean(config.GMAIL_USER?.trim() && config.GMAIL_APP_PASSWORD?.trim());
  if ((provider === 'gmail' && !gmailReady) || (!gmailReady && (!config.RESEND_API_KEY || !config.EMAIL_FROM))) {
    return { emailSent: false, notificationSent: false };
  }
  const transport = gmailReady ? nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: config.GMAIL_USER!.trim(), pass: config.GMAIL_APP_PASSWORD!.replace(/\s/g, '') },
    connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000,
    disableFileAccess: true, disableUrlAccess: true,
  }) : null;
  const owner = config.NOTIFICATION_EMAIL || 'infosyedashja@gmail.com';
  const replyAddress = config.REPLY_TO_EMAIL?.trim() || owner;
  const website = config.SITE_URL || 'https://khowabi.com';
  const brief = `Reference: ${enquiry.id}\nService: ${enquiry.service}\nCompany: ${enquiry.company || 'Not provided'}\nBudget: ${enquiry.budget}\nTimeline: ${enquiry.timeline}\n\nProject details:\n${enquiry.details}`;
  async function send(kind: string, to: string, replyTo: string, subject: string, text: string) {
    try {
      if (transport) {
        const result = await transport.sendMail({
          from: { name: 'KHOWABI', address: config.GMAIL_USER!.trim() },
          to, replyTo, subject, text,
        });
        const accepted = result.accepted?.length > 0;
        if (!accepted) console.error('Enquiry email not accepted', { id: enquiry.id, kind });
        return accepted;
      }
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: AbortSignal.timeout(10000),
        headers: {
          Authorization: `Bearer ${config.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `${enquiry.id}-${kind}`,
        },
        body: JSON.stringify({ from: config.EMAIL_FROM, to: [to], reply_to: replyTo, subject, text }),
      });
      if (!response.ok) console.error('Enquiry email rejected', { id: enquiry.id, kind, status: response.status });
      return response.ok;
    } catch (error) {
      const failure = error as {code?: string; responseCode?: number};
      console.error('Enquiry email unavailable', { id: enquiry.id, kind, code: failure.code, smtpStatus: failure.responseCode });
      return false;
    }
  }
  // Independent sends: a failed client confirmation must not block the owner notification.
  const [emailSent, notificationSent] = await Promise.all([
    send('client', enquiry.email, replyAddress, `We received your project enquiry | KHOWABI | ${enquiry.id}`,
      `Hello ${enquiry.name},\n\nThank you for choosing KHOWABI! Your project enquiry has been received successfully. We look forward to learning more about your idea.\n\n${brief}\n\nOur team will review your requirements and get in touch. You can reply to this email or message us on WhatsApp: https://wa.me/923132244506\n\nKHOWABI\n${website}`),
    send('owner', owner, enquiry.email, `New project enquiry | ${enquiry.service} | ${enquiry.id}`,
      `A new project enquiry has been submitted on the KHOWABI website.\n\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone / WhatsApp: ${enquiry.phone}\n${brief}\n\nReply to this email to contact the client.`),
  ]);
  return { emailSent, notificationSent };
}
