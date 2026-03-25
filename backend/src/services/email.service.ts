import nodemailer from 'nodemailer';
import logger from '../utils/logger';

// Configured exclusively as requested for the developer notifications and OTP dispatch.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

export const sendDeveloperNotification = async (subject: string, data: any) => {
  try {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
      logger.info(`[DEV MODE] Skipping developer notification: ${subject}`);
      return;
    }

    const mailOptions = {
      from: '"ReputeChain Security Monitor" <system@reputechain.io>',
      to: 'hariomofficial.18@gmail.com',
      subject: `[ReputeChain Monitor] ${subject}`,
      text: JSON.stringify(data, null, 2),
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Dev notification sent successfully: ${subject}`);
  } catch (error) {
    logger.error('Failed to send dev notification', error);
  }
};

export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
      logger.info(`[DEV MODE] Mock OTP for ${to}: ${otp}`);
      return;
    }

    const mailOptions = {
      from: `"ReputeChain Security" <${process.env.EMAIL_USER || 'security@reputechain.io'}>`,
      to,
      subject: 'Your ReputeChain Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`,
      html: `<h3>ReputeChain Password Reset</h3><p>Your OTP is: <strong style="font-size: 24px;">${otp}</strong></p><p>It is valid for 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`OTP successfully dispatched to ${to}`);
  } catch (error) {
    logger.error(`Failed to send OTP to ${to}`, error);
    throw new Error('Failed to dispatch email');
  }
};
