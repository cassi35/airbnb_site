"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
exports.default = (0, utils_1.defineRoutes)(app => {
    app.get('/', (req, res) => {
        res.send('Welcome to the home page!');
    });
});
