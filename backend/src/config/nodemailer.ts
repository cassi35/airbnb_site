import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.SENDER_EMAIL_FROM_GMAIL,
        pass:process.env.SENHA_DE_APP
    }
})
export default transporter