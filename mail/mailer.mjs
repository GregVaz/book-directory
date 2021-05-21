import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import template from './mail.mjs';
import dotenv from 'dotenv';

dotenv.config();

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.EMAIL_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken();

let transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.EMAIL_CLIENT_ID,
    clientSecret: process.env.EMAIL_CLIENT_SECRET,
    refreshToken: process.env.EMAIL_REFRESH_TOKEN,
    accessToken
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default async function sendEmail(create, book) {
  let html_body = template(book.title, create ? 'created' : 'deleted');
  const message = {
    from: process.env.EMAIL_USER, // Sender address
    to: book.userId,         // List of recipients
    subject: create ? 'A new book was registered' : 'A book was deleted', // Subject line
    generateTextFromHTML: true,
    html: html_body
  };

  transport.sendMail(message, function(err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}
