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
const database_1 = require("./database"); // Use caminho relativo aqui
const cookie_1 = __importDefault(require("@fastify/cookie"));
const redis_1 = require("./plugins/redis"); // Use caminho relativo aqui
const fastify_bcrypt_1 = __importDefault(require("fastify-bcrypt"));
const cloudinary_js_1 = require("#config/cloudinary.js");
const stripe_js_1 = require("#config/stripe.js");
const sentry_js_1 = require("#config/sentry.js");
const hook_1 = require("hooks/hook");
const app = (0, fastify_1.default)({ logger: true }).withTypeProvider();
// Função assíncrona para garantir a ordem correta de inicialização
async function startServer() {
    try {
        // 1. Registrar plugins básicos primeiro
        app.register(cookie_1.default, {
            secret: process.env.COOKIE_SECRET || 'meu-segredo-para-assinar-cookies',
            hook: 'onRequest',
            parseOptions: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            }
        });
        app.register(cors_1.default, { origin: "*" });
        app.register(jwt_1.default, {
            secret: process.env.JWT_SECRET
        });
        app.register(fastify_bcrypt_1.default, { saltWorkFactor: 10 });
        // 2. Conectar ao banco ANTES de registrar rotas
        await (0, database_1.connectDB)(app);
        await (0, redis_1.connectRedis)(app);
        await (0, cloudinary_js_1.cloundinaryConnection)();
        await (0, stripe_js_1.stripeConnection)(); // Certifique-se de que a função stripeConnection está importada corretamente
        await (0, sentry_js_1.initSentry)(); // Inicializar o Sentry
        // 3. Registrar o swagger
        app.register(swegger_1.connectSwagger);
        // 4. Registrar as rotas DEPOIS da conexão ao banco
        app.register(autoload_1.default, {
            dir: path_1.default.join(__dirname, "routes"),
            routeParams: true
        });
        // 5. Registrar hooks
        app.addHook("onRoute", ({ method, path }) => {
            if (method == "HEAD" || method == "OPTIONS") {
                return;
            }
            consola_1.default.success(`Route registered: ${chalk_1.default.yellow(method)} ${chalk_1.default.blue(path)}`);
        });
        app.register(hook_1.hooksFastify);
        // 6. Iniciar o servidor
        const PORT = Number(process.env.PORT) || 3000;
        await app.listen({ port: PORT, host: "" });
        console.log(`${chalk_1.default.green("Servidor rodando na porta")} ${PORT} ${chalk_1.default.blue("http://localhost:" + PORT)}`);
    }
    catch (error) {
        consola_1.default.error(chalk_1.default.red('Error starting server:', error));
        process.exit(1);
    }
}
startServer();
