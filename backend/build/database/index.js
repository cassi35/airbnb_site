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
        app.register(mongodb_1.default, {
            forceClose: true, // Fecha a conexão ao encerrar o servidor 
            url: url, // URL de conexão do MongoDB
            name: 'airbnb_project', // Nome da conexão, pode ser usado para referenciar
        });
        consola_1.default.success(`${chalk_1.default.green("MongoDB connected successfully")}`);
    }
    catch (error) {
        console.log(`${chalk_1.default.red("Error connecting to the database")}`, error);
        process.exit(1);
    }
}
