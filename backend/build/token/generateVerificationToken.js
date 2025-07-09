"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationToken = void 0;
const generateVerificationToken = () => {
    const token = Math.floor(10000 + Math.random() * 90000).toString();
    return token;
};
exports.generateVerificationToken = generateVerificationToken;
