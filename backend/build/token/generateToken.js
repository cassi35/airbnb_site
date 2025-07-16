"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.setTokenCookie = exports.generateJWT = void 0;
// Apenas gera o token JWT
const generateJWT = (app, id, email) => {
    return app.jwt.sign({ id, email }, { expiresIn: "1d" });
};
exports.generateJWT = generateJWT;
// Configura cookie (usado apenas nas rotas)
const setTokenCookie = (reply, token) => {
    reply.setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};
exports.setTokenCookie = setTokenCookie;
// Função modificada para não precisar do reply
const generateToken = (app, id, email) => {
    return (0, exports.generateJWT)(app, id, email);
};
exports.generateToken = generateToken;
