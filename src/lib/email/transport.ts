import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

declare global {
  var transporter: nodemailer.Transporter | undefined;
}

const getTransporter = () => {
  if (global.transporter) {
    return global.transporter;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD?.replace(/\s+/g, ""),
    },
  });

  if (process.env.NODE_ENV !== "production") {
    global.transporter = transporter;
  }

  return transporter;
};

export const transporter = getTransporter();

export const verifyConnection = async () => {
  try {
    console.log("[SMTP] Verifying connection...");
    await transporter.verify();
    console.log("[SMTP] Connection verified successfully");
    return true;
  } catch (error) {
    console.error("[SMTP] Connection failed:", error);
    return false;
  }
};

