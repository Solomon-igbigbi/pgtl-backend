"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.map)((res) => this.responseHandler(res, context, startTime)), (0, operators_1.catchError)((err) => (0, rxjs_1.throwError)(() => this.errorHandler(err, context, startTime))));
    }
    responseHandler(res, context, startTime) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        return {
            statusCode: response.statusCode,
            success: true,
            message: 'Request successful',
            result: res,
            path: request.url,
            duration: Date.now() - startTime,
            timestamp: Date.now(),
        };
    }
    errorHandler(exception, context, startTime) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const message = exception?.getResponse ? exception.getResponse().message : exception.message;
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof common_1.BadRequestException && typeof message === 'object') {
            const errors = message.map((data) => {
                const issue = { field: '', errors: [] };
                if (data?.constraints) {
                    issue.field = data.property;
                    issue.errors = Object.values(data.constraints);
                }
                return issue;
            });
            return response.status(status).json({
                statusCode: status,
                success: false,
                message: 'Bad Request',
                errors,
                path: request.path,
                duration: Date.now() - startTime,
                timestamp: Date.now(),
            });
        }
        response.status(status).json({
            statusCode: status,
            success: false,
            message: message ?? 'Request failed',
            path: request.url,
            duration: Date.now() - startTime,
            timestamp: Date.now(),
        });
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map