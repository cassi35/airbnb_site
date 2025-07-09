"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const console_1 = __importDefault(require("console"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Criando o transportador SMTP
exports.transporter = nodemailer_1.default.createTransport({
    host: 'smtp-relay.brevo.com', // Host SMTP (Brevo/SendinBlue)
    port: 587, // Porta SMTP padrão
    auth: {
        user: process.env.SMTP_USER || '8b4176002@smtp-brevo.com', // Seu usuário SMTP
        pass: process.env.SMTP_PASS // Sua senha/API key SMTP
    }
});
// Verificar configuração no startup
exports.transporter.verify(function (error, success) {
    if (error) {
        console_1.default.error('Erro na configuração SMTP:', error);
    }
    else {
        console_1.default.info('Configuração SMTP está correta. Pronto para enviar emails!');
    }
});
