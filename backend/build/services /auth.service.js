"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consola_1 = __importDefault(require("consola"));
const chalk_1 = __importDefault(require("chalk"));
class AuthService {
    app;
    userCollection;
    constructor(fastify) {
        this.app = fastify;
        this.userCollection = this.app.mongo.db?.collection("users");
    }
    async createUser(userData) {
        try {
        }
        catch (error) {
            consola_1.default.error(chalk_1.default.red('Error creating user:', error));
            throw new Error('Failed to create user');
        }
    }
}
exports.default = AuthService;
//colocar redis aqul
