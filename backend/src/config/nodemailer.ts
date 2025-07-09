import nodemailer from 'nodemailer'

// Criando o transportador SMTP
export const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // Host SMTP (Brevo/SendinBlue)
    port: 587, // Porta SMTP padrão
    secure: false, // true para 465, false para outras portas
    auth: {
        user: process.env.STMP_USER || '8b4176001@smtp-brevo.com', // Seu usuário SMTP
        pass: process.env.STMP_PASS // Sua senha/API key SMTP
    }
});
