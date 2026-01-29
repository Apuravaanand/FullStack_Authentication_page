import { sendEmail } from "./mailer.js";

(async () => {
  try {
    await sendEmail(
      "erapuravaanand@gmail.com", // receiver email
      "Test OTP",
      "Your OTP is 6789678"
    );

    console.log("✅ Test email sent successfully");
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
})();
