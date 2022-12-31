import nodemailer from 'nodemailer'
const email="muniba.fjwu@gmail.com";
var smtpTransport = nodemailer.createTransport(
    {
        service:"gmail",
        auth: {
            user: email,
            pass: "umtertiicsmgwhvm"
        }
    }      
);
const mailOptions = {
    from: email, 
    to: 'muniba.hina@teo-intl.com',
    subject: 'Node Mailer', 
    text: 'Hello People!, Welcome to Bacancy!',
};

smtpTransport.sendMail(mailOptions, function(err, info) {
   if (err) {
     console.log(err)
   } else {
     console.log(info);
   }
});

