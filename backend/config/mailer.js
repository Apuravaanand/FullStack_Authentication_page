import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 ALWAYS load .env relative to THIS FILE
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Debug (remove later)
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

export const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Auth App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
