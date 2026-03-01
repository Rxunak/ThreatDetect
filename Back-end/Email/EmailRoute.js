import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const hasValue = (v) => Boolean(v && String(v).trim());
const isPlaceholder = (v) =>
  ["your-email@gmail.com", "your-app-password"].includes(String(v).trim());

const emailConfigured =
  hasValue(process.env.EMAIL_USERNAME) &&
  hasValue(process.env.EMAIL_PASSWORD) &&
  !isPlaceholder(process.env.EMAIL_USERNAME) &&
  !isPlaceholder(process.env.EMAIL_PASSWORD);

const sendEmail = emailConfigured
  ? nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

export const sendEmailAlert = async (to, subject, text) => {
  if (!emailConfigured || !sendEmail) {
    console.warn(
      "Email skipped: EMAIL_USERNAME/EMAIL_PASSWORD are not configured."
    );
    return { sent: false, reason: "email_not_configured" };
  }

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    text,
  };

  try {
    await sendEmail.sendMail(mailOptions);
    console.log("Email sent Succesfully!!");
    return { sent: true };
  } catch (error) {
    console.log(error);
    return { sent: false, reason: "send_failed", error: error.message };
  }
};
