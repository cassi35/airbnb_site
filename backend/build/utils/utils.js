"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineRoutes = defineRoutes;
function defineRoutes(handler) {
    return function (app, _, done) {
        handler(app);
        done();
    };
}
