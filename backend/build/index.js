"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const autoload_1 = __importDefault(require("@fastify/autoload"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const consola_1 = __importDefault(require("consola"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const swegger_1 = require("./plugins/swegger");
const database_1 = require("database");
const cookie_1 = __importDefault(require("@fastify/cookie"));
const redis_1 = require("plugins/redis");
const app = (0, fastify_1.default)({ logger: true }).withTypeProvider();
//registrando o plugin de cookie 
app.register(cookie_1.default, {
    secret: process.env.COOKIE_SECRET || 'my-secret', // para cookies assinados
    hook: 'onRequest', // opcional, define quando os cookies serão analisados
});
//swagger  
app.register(swegger_1.connectSwagger);
//env 
const PORT = process.env.PORT || 3000;
//middleware gobais 
app.register(cors_1.default, { origin: "*" });
app.register(autoload_1.default, {
    dir: path_1.default.join(__dirname, "routes"),
    routeParams: true
});
// middleare de tratamento 
//conectando ao banco de dados 
app.register(database_1.connectDB);
app.register(redis_1.connectRedis);
//middleware de autenticação
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET
});
//hooks 
app.addHook("onRoute", ({ method, path }) => {
    if (method == "HEAD" || method == "OPTIONS") {
        return;
    }
    consola_1.default.success(`Route registered: ${chalk_1.default.yellow(method)} ${chalk_1.default.blue(path)}`);
});
//rotas 
//inializacao do servidor 
app.listen({ port: PORT, host: "" })
    .then(() => {
    console.log(`${chalk_1.default.green("Servidor rodando na porta 3000")} ${chalk_1.default.blue("http://localhost:3000")}`);
}).catch(() => {
    consola_1.default.error(`${chalk_1.default.red("Erro ao iniciar o servidor")}`);
    process.exit(1);
});
