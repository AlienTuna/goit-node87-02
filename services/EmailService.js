const nodemailer = require('nodemailer');
// const path = require('path');
// const pug = require('pug');
// const { convert } = require('html-to-text');

const dotenv = require('dotenv')
dotenv.config({path: './envs/dev.env'});
const {MAILGUN_USER, MAILGUN_PASS, MAIL_FROM} = process.env;

class Email {
  constructor(user, verifyUrl) {
    this.to = user.email;
    this.name = user.name;
    this.verifyUrl = verifyUrl;
    this.from = MAIL_FROM;
  }

  _initTransport() {
      return nodemailer.createTransport({
        // service: 'Sendgrid',
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
          user: MAILGUN_USER,
          pass: MAILGUN_PASS,
        },
      });
  }

  async _send(subject) {
    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html: `<p style="margin: 0;">Tap the button below to confirm your email address. </p><a href="${this.verifyUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; margin:20px; font-size: 20px; color: #ffffff; text-decoration: none; border-radius: 6px; border: solid grey; background: grey">Verify</a><p>Or copy this link to browser: ${this.verifyUrl}</p>`,
    };

    await this._initTransport().sendMail(emailConfig);
  }


  async sendVerificationEmail() {
    await this._send('Verification for your email');
  }
}

module.exports = Email;
