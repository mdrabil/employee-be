import nodemailer from "nodemailer";

export const sendMail = async (to, subject, html) => {
  try {
    // Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,   // 👈 your Gmail ID
        pass: process.env.MAIL_PASS,   // 👈 App Password (not your Gmail login password!)
      },
    });

    const mailOptions = {
      from: `"HR Team" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent to", to);
  } catch (error) {
    console.error("❌ Mail error:", error.message);
  }
};
