"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
exports.default = (0, utils_1.defineRoutes)(app => {
    app.get('/', {
        schema: {
            description: "Home route",
            tags: ["Home"],
            response: {
                200: {
                    description: "Home route",
                    type: "string"
                }
            }
        }
    }, async (req, res) => {
        res.send('Welcome to the AirBnb API');
    });
});
