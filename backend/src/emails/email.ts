import  log  from 'console'
import {transporter} from '../config/nodemailer'
import { templateEmailVerify, templateEmailWelcome } from './emailTemplate';
interface MailOptions{
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}
export const sendVerificationToken = async (token:string,email:string):Promise<void>=>{
    try {
        const mailOptions:MailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'Verify your email',
            html:templateEmailVerify(token)
        }
        log.info('Tentando enviar email para:', email);
        log.info('Usando remetente:', process.env.SENDER_EMAIL);
        await transporter.sendMail(mailOptions)
        log.info('Verification email sent successfully to:', email);
    } catch (error) {
        log.error('Error sending verification token:', error);
    }
}
export const welcomeEmail = async (email:string):Promise<void>=>{
    try {
        const mailOptions:MailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Service',
            html: templateEmailWelcome(email)
        }
        await transporter.sendMail(mailOptions)
        log.info('Welcome email sent successfully to:', email);
    } catch (error) {
        log.error('Error sending welcome email:', error);
    }
}