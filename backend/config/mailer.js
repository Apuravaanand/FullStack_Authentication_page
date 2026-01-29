import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const sendOtpEmail = async (to, otp, type = "verify") => {
  const subject =
    type === "reset"
      ? "Password Reset OTP"
      : "Email Verification OTP";

  const htmlContent = `
    <h2>Your OTP</h2>
    <p>Your OTP is <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
  `;

  try {
    await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: "Auth App",
          email: process.env.EMAIL_FROM,
        },
        to: [{ email: to }],
        subject,
        htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ OTP email sent");
  } catch (error) {
    console.error(
      "❌ Email send failed:",
      error.response?.data || error.message
    );
    throw new Error("Email service failed");
  }
};

export default sendOtpEmail;
