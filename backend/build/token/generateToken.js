"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const generateToken = (app, id, reply) => {
    const token = app.jwt.sign({ id }, { expiresIn: "1d" });
    reply.setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return token;
};
exports.generateToken = generateToken;
