declare const _default: (() => {
    port: number;
    corsOrigin: string;
    nodeEnv: string;
    swagger: {
        username: string;
        password: string;
    };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    corsOrigin: string;
    nodeEnv: string;
    swagger: {
        username: string;
        password: string;
    };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
}>;
export default _default;
