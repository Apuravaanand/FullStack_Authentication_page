import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail app password
  },
});

// Generate 6-digit OTP
export const generateOTP = () => crypto.randomInt(100000, 999999);

// Send Email function
export const sendEmail = async (toEmail, otp, type = "verify") => {
  let subject, text, html;

  switch (type) {
    case "verify":
      subject = "Email Verification OTP";
      text = `Your verification code is: ${otp}`;
      html = `<p>Your verification code is: <strong>${otp}</strong></p>`;
      break;
    case "reset":
      subject = "Password Reset OTP";
      text = `Your password reset code is: ${otp}`;
      html = `<p>Your password reset code is: <strong>${otp}</strong></p>`;
      break;
    default:
      subject = "Your OTP Code";
      text = `Your OTP code is: ${otp}`;
      html = `<p>Your OTP code is: <strong>${otp}</strong></p>`;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail} for type "${type}"`);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
