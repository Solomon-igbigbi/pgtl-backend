"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('common', () => ({
    port: parseInt(process.env.PORT, 10) || 3001,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development',
    swagger: {
        username: process.env.SWAGGER_USERNAME || 'admin',
        password: process.env.SWAGGER_PASSWORD || 'secret',
    },
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'password',
        name: process.env.DATABASE_NAME || 'pgtl_test',
    },
}));
//# sourceMappingURL=common.config.js.map