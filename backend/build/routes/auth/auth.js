"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signup_1 = require("../../controllers/auth/signup");
const utils_1 = require("../../utils/utils");
exports.default = (0, utils_1.defineRoutes)(app => {
    app.post('/signup', signup_1.signupController);
});
