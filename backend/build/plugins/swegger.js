"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSwagger = void 0;
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const chalk_1 = __importDefault(require("chalk"));
const consola_1 = __importDefault(require("consola"));
const connectSwagger = async (app) => {
    try {
        await app.register(swagger_1.default, {
            swagger: {
                info: {
                    title: "AirBnb API",
                    description: "API for AirBnb clone",
                    version: "1.0.0"
                },
                host: process.env.HOST || "http://localhost:3000",
                schemes: ["http"],
                consumes: ["application/json"],
                produces: ["application/json"],
            }
        });
        console.log(`${chalk_1.default.green("Swagger connected successfully")}`);
        await app.register(swagger_ui_1.default, {
            routePrefix: '/docs',
            uiConfig: {
                docExpansion: "full",
                deepLinking: true,
            }
        });
    }
    catch (error) {
        consola_1.default.error(`${chalk_1.default.red("Error connecting to Swagger")}`, error);
        process.exit(1);
    }
};
exports.connectSwagger = connectSwagger;
