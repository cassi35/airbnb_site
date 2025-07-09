"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Criando o transportador SMTP
exports.transporter = nodemailer_1.default.createTransport({
    host: 'smtp-relay.brevo.com', // Host SMTP (Brevo/SendinBlue)
    port: 587, // Porta SMTP padrão
    secure: false, // true para 465, false para outras portas
    auth: {
        user: process.env.STMP_USER || '8b4176001@smtp-brevo.com', // Seu usuário SMTP
        pass: process.env.STMP_PASS // Sua senha/API key SMTP
    }
});
