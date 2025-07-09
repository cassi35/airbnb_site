"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeEmail = exports.sendVerificationToken = void 0;
const console_1 = __importDefault(require("console"));
const nodemailer_1 = require("../config/nodemailer");
const emailTemplate_1 = require("./emailTemplate");
const sendVerificationToken = async (token, email) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Verify your email',
            html: (0, emailTemplate_1.templateEmailVerify)(token)
        };
        console_1.default.info('Tentando enviar email para:', email);
        console_1.default.info('Usando remetente:', process.env.SENDER_EMAIL);
        await nodemailer_1.transporter.sendMail(mailOptions);
        console_1.default.info('Verification email sent successfully to:', email);
    }
    catch (error) {
        console_1.default.error('Error sending verification token:', error);
    }
};
exports.sendVerificationToken = sendVerificationToken;
const welcomeEmail = async (email) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Service',
            html: (0, emailTemplate_1.templateEmailWelcome)(email)
        };
        await nodemailer_1.transporter.sendMail(mailOptions);
        console_1.default.info('Welcome email sent successfully to:', email);
    }
    catch (error) {
        console_1.default.error('Error sending welcome email:', error);
    }
};
exports.welcomeEmail = welcomeEmail;
