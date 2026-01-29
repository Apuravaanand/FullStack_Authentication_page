import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // 465 uses SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Fire-and-forget email sending.
 * Does NOT block API response.
 */
const sendEmail = (email, otp, type = "verify") => {
  const subject = type === "reset" ? "Password Reset OTP" : "Email Verification OTP";

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: `Your OTP is ${otp}`,
  }).catch(err => console.error("Email send error:", err.message));
};

export default sendEmail;
