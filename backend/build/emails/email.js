"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeEmail = exports.sendVerificationToken = void 0;
const console_1 = __importDefault(require("console"));
const emailTemplate_1 = require("./emailTemplate");
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const sendVerificationToken = async (token, email) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL_FROM_GMAIL,
            to: email,
            subject: 'Verify your email',
            html: (0, emailTemplate_1.templateEmailVerify)(token)
        };
        console_1.default.info('Tentando enviar email para:', email);
        await nodemailer_1.default.sendMail(mailOptions).then((info) => {
            console_1.default.info('Email enviado com sucesso:', info.response);
        }).catch(error => {
            console_1.default.error('Erro ao enviar email:', error);
            throw new Error('Failed to send verification email');
        });
        console_1.default.info('Verification email sent successfully to:', email);
        return true;
    }
    catch (error) {
        console_1.default.error('Error sending verification token:', error);
        return false;
    }
};
exports.sendVerificationToken = sendVerificationToken;
const welcomeEmail = async (email) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL_FROM_GMAIL,
            to: email,
            subject: 'Welcome to Our Service',
            html: (0, emailTemplate_1.templateEmailWelcome)(email)
        };
        console_1.default.info('Tentando enviar email para:', email);
        await nodemailer_1.default.sendMail(mailOptions).then((info) => {
            console_1.default.info('Email enviado com sucesso:', info.response);
        }).catch(error => {
            console_1.default.error('Erro ao enviar email:', error);
            throw new Error('Failed to send verification email');
        });
        return true;
        console_1.default.info('Welcome email sent successfully to:', email);
    }
    catch (error) {
        console_1.default.error('Error sending welcome email:', error);
        return false;
    }
};
exports.welcomeEmail = welcomeEmail;
