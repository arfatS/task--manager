const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'arfatsarole@gmail.com',
        subject: 'Welcome to Task Manager App',
        text: `Welcome ${name}, enjoy all the services of our application.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'arfatsarole@gmail.com',
        subject: 'Account Deletion Check',
        text: `Hey ${name}, we hope you enjoyed the services of our application. Looking forward!!`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}