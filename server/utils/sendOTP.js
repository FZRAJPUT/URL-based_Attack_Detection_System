import Brevo from "@getbrevo/brevo";

export const sendOTPEmail = async (email, otp) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    // --- Modern, Tailwind-inspired HTML Template ---
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px 20px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); padding: 40px;">
          
          <h1 style="color: #1f2937; font-size: 24px; font-weight: 700; margin-bottom: 20px;">
            OTP Verification Required
          </h1>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Thank you for using InputShield! Please use the following One-Time Password (OTP) to complete your verification process.
          </p>

          <div style="margin-bottom: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
              Your One-Time Password (OTP) is:
            </p>
            <div style="display: inline-block; padding: 15px 30px; background-color: #e0f2f1; border: 2px solid #2dd4bf; border-radius: 8px;">
              <strong style="color: #0d9488; font-size: 32px; letter-spacing: 5px; font-weight: 700; user-select: text;">
                ${otp}
              </strong>
            </div>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This code is valid for a limited time and should not be shared with anyone.
          </p>
          
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
          © InputShield. All rights reserved.
        </p>
      </div>
    `;
    // ---------------------------------------------------

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "InputShield", email: process.env.EMAIL_USER };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "🔒 Your InputShield OTP Code";
    sendSmtpEmail.htmlContent = htmlTemplate; // Use the styled template
    sendSmtpEmail.textContent = `Your OTP is ${otp}. This code should not be shared with anyone.`;
    
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { message: "Email sent..", success: true };
  } catch (error) {
    console.error("Brevo Email Error:", error);
    return { error: error.message || error, success: false };
  }
};