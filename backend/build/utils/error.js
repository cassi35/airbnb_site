"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = handler;
const http_status_codes_1 = require("http-status-codes");
const v4_1 = require("zod/v4");
function handler(error, _, reply) {
    if (error instanceof v4_1.ZodError) {
        return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "Validation error",
            errors: error
        });
    }
    if (error.validation) {
        return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "Validation error",
            errors: error.validation
        });
    }
    return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
        error: error.message
    });
}
