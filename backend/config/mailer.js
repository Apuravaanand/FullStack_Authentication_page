import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("📨 mailer.js loaded");
console.log("SMTP USER:", process.env.EMAIL_USER);
console.log("SMTP PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) console.log("❌ SMTP VERIFY ERROR:", err.message);
  else console.log("✅ SMTP VERIFIED");
});

const sendEmail = async (email, otp) => {
  console.log("➡️ Sending OTP:", otp, "to", email);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  });

  console.log("✅ OTP Email Sent");
};

export default sendEmail;
