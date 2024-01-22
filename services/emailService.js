const nodemailer = require('nodemailer');

exports.initTransport =  nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587 ,
    auth: {
        user: 'postmaster@sandbox35220b3fee8343a4b88c663501177283.mailgun.org',
        pass: '9cddfa46cc7c56ffcabe7f1a160a180e-063062da-34d5bb46',
    }
    // 4d60573d93aa549692510a6ec3073076-063062da-2e2c845f
})