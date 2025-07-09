"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const chalk_1 = __importDefault(require("chalk"));
const mongodb_1 = __importDefault(require("@fastify/mongodb"));
const consola_1 = __importDefault(require("consola"));
async function connectDB(app) {
    try {
        const url = process.env.DATABASE_CONNECTION;
        consola_1.default.info(`Tentando conectar ao MongoDB: ${url?.substring(0, 20)}...`);
        await app.register(mongodb_1.default, {
            forceClose: true,
            url: url,
            name: 'airbnb_project',
        });
        // Teste a conexão explicitamente
        await app.mongo.client.connect();
        await app.mongo.db?.command({ ping: 1 });
        consola_1.default.success(`${chalk_1.default.green("MongoDB conectado com sucesso!")}`);
    }
    catch (error) {
        consola_1.default.error(`${chalk_1.default.red("Erro ao conectar ao MongoDB:")}`, error);
        process.exit(1);
    }
}
