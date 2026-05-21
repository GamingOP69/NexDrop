import nodemailer from 'nodemailer';
import { env } from './env';

type Mail = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(mail: Mail) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email skipped (SMTP not configured):', mail.subject, mail.to);
    }
    return;
  }

  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

  await transport.sendMail({
    from: env.EMAIL_FROM,
    to: mail.to,
    subject: mail.subject,
    html: mail.html
  });
}
