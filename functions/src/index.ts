import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

// Configure nodemailer with your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});

export const sendInviteEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to send invites'
    );
  }

  const { to, recipientName, inviterName, treeName, inviteLink } = data;

  const mailOptions = {
    from: '"Family Tree App" <noreply@familytree.app>',
    to,
    subject: `${inviterName} invited you to join their family tree`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #c15329; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Family Tree Invitation</h1>
        </div>
        
        <div style="padding: 20px; background-color: #ffffff;">
          <p>Hello ${recipientName},</p>
          
          <p>${inviterName} has invited you to join their family tree "${treeName}" on Family Tree App.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${inviteLink}" 
               style="background-color: #c15329; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 6px;
                      display: inline-block;">
              Join Family Tree
            </a>
          </div>
          
          <p>This invitation will expire in 7 days.</p>
          
          <p>If you can't click the button above, copy and paste this link into your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; word-break: break-all;">
            ${inviteLink}
          </p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; color: #666;">
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});