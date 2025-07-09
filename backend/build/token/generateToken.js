"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.setTokenCookie = exports.generateJWT = void 0;
// Apenas gera o token JWT
const generateJWT = (app, id) => {
    return app.jwt.sign({ id }, { expiresIn: "1d" });
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
// Função completa (para uso nas rotas)
const generateToken = (app, id, reply) => {
    const token = (0, exports.generateJWT)(app, id);
    (0, exports.setTokenCookie)(reply, token);
    return token;
};
exports.generateToken = generateToken;
