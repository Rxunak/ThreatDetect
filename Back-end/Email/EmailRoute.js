import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("SMTP User:", process.env.EMAIL_USERNAME);
console.log("SMTP Password Loaded:", !!process.env.EMAIL_PASSWORD);

const sendEmail = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmailAlert = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    text,
  };

  try {
    await sendEmail.sendMail(mailOptions);
    console.log("Email sent Succesfully!!");
  } catch (error) {
    console.log(error);
  }
};
