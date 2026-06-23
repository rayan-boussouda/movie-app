import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string,
): Promise<void> => {
  const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: 'Reset your password',
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
};
