import nodemailer from "nodemailer";
import { google } from "googleapis";
import env from "dotenv";
env.config();

import ejs from "ejs";
import path from "node:path";

const GOOGLE_ID = process.env.GOOGLE_ID as string;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET as string;
const GOOGLE_URL = process.env.GOOGLE_URL as string;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN as string;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_TOKEN });

export const sendCreateAccountEmail = async () => {
  const accessToken: any = (await oAuth.getAccessToken()).token;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USER,
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_TOKEN,
      accessToken: accessToken,
    },
  });

  const pathFile = path.join(__dirname, "../view/index.ejs");

  const html = await ejs.renderFile(pathFile);
  const mailData = {
    to: "emmach793@gmail.com",
    from: `no  reply <${process.env.MAIL_USER}>`,
    subject: "Account Information",
    text: "This is just a test message",
    html: `<div>
    This is just the start <button style={{backkgroundColor: "red"}}>Click me</button>
    </div>`,
  };

  transporter.sendMail(mailData).then(() => {
    console.log("mail sent");
  });
};
