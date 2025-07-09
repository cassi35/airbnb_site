import  log  from 'console'
import {Resend} from 'resend'
import { templateEmailVerify, templateEmailWelcome } from './emailTemplate';
const resend = new Resend(process.env.RESEND_API_KEY)
interface MailOptions{
    from: string;
    to: string[];
    subject: string;
    html?: string;
}
export const sendVerificationToken = async (token:string,email:string):Promise<void>=>{
    try {
        const mailOptions:MailOptions = {
            from:process.env.SENDER_EMAIL,
            to:[email],
            subject:'Verify your email',
            html:templateEmailVerify(token)
        }
        log.info('Tentando enviar email para:', email);
        const {error,data} = await resend.emails.send( {});
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
      
        log.info('Welcome email sent successfully to:', email);
    } catch (error) {
        log.error('Error sending welcome email:', error);
    }
}