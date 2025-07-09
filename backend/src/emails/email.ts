import  log, { error }  from 'console'
import { templateEmailVerify, templateEmailWelcome } from './emailTemplate';
import transporter from '../config/nodemailer';
interface MailOptions {
    from: string | undefined;
    to: string | undefined;
    subject: string;
    html: string;
}
export const sendVerificationToken = async (token:string,email:string):Promise<boolean>=>{
    try {
        const mailOptions:MailOptions = {
            from:process.env.SENDER_EMAIL_FROM_GMAIL,
            to:email,
            subject:'Verify your email',
            html:templateEmailVerify(token)
        }
        log.info('Tentando enviar email para:', email);
        await transporter.sendMail(mailOptions).then((info)=>{
            log.info('Email enviado com sucesso:', info.response);
        }).catch(error=>{
            log.error('Erro ao enviar email:', error);
            throw new Error('Failed to send verification email');
        })
        log.info('Verification email sent successfully to:', email);
        return true 
    } catch (error) {
        log.error('Error sending verification token:', error);
        return false
    }
}
export const welcomeEmail = async (email:string):Promise<boolean>=>{
    try {
        const mailOptions:MailOptions = {
            from: process.env.SENDER_EMAIL_FROM_GMAIL,
            to: email,
            subject: 'Welcome to Our Service',
            html: templateEmailWelcome(email)
        }
        log.info('Tentando enviar email para:', email);
        await transporter.sendMail(mailOptions).then((info)=>{
            log.info('Email enviado com sucesso:', info.response);
        }).catch(error=>{
            log.error('Erro ao enviar email:', error);
            throw new Error('Failed to send verification email');
        })
        return true
        log.info('Welcome email sent successfully to:', email);
    } catch (error) {
        log.error('Error sending welcome email:', error);
        return false
    }
}