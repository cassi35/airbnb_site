import  log  from 'console';
import nodemailer from 'nodemailer'

// Criando o transportador SMTP
export const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // Host SMTP (Brevo/SendinBlue)
    port: 587, // Porta SMTP padrão
    auth: {
        user: process.env.SMTP_USER || '8b4176002@smtp-brevo.com', // Seu usuário SMTP
        pass: process.env.SMTP_PASS // Sua senha/API key SMTP
    }
});
// Verificar configuração no startup
transporter.verify(function(error, success) {
    if (error) {
        log.error('Erro na configuração SMTP:', error);
    } else {
        log.info('Configuração SMTP está correta. Pronto para enviar emails!');
    }
});