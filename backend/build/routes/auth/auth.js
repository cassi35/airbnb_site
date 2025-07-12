"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgotPassword_js_1 = require("#controllers/auth/forgotPassword.js");
const getUser_js_1 = require("#controllers/auth/getUser.js");
const login_js_1 = require("#controllers/auth/login.js");
const logout_js_1 = require("#controllers/auth/logout.js");
const resendTokenVerification_js_1 = require("#controllers/auth/resendTokenVerification.js");
const resetPassword_js_1 = require("#controllers/auth/resetPassword.js");
const signup_js_1 = require("#controllers/auth/signup.js");
const verifyEmail_js_1 = require("#controllers/auth/verifyEmail.js");
const utils_js_1 = require("#utils/utils.js");
exports.default = (0, utils_js_1.defineRoutes)(app => {
    app.post('/signup', signup_js_1.signupController),
        app.post('/verify-email', verifyEmail_js_1.verifyEmailController),
        app.post('/login', login_js_1.loginController),
        app.post('/logout', logout_js_1.logoutController),
        app.post('/forgot-password', forgotPassword_js_1.forgotPasswordController),
        app.post('/reset-password', resetPassword_js_1.resetPasswordController),
        app.post('/resend-verification-token', resendTokenVerification_js_1.resendVerificationTokenController),
        app.post('/user', getUser_js_1.getUserController);
});
