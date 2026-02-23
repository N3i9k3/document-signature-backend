import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const sendEmail = async (to, link) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Please Sign Document",
      html: `<h3>You have a document to sign</h3><a href="${link}">Click here to sign</a>`,
    });

    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

export default sendEmail;
