"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const broker_1 = require("../../../broker/broker");
const processFraudFile_usecase_1 = require("../usecases/processFraudFile.usecase");
const fetchFlaggedTransactions_usecase_1 = require("../usecases/fetchFlaggedTransactions.usecase");
const fraudCheck_dto_1 = require("../dtos/fraudCheck.dto");
let FraudController = class FraudController {
    constructor(broker, processFraudFileUsecase, fetchFlaggedTransactionsUsecase) {
        this.broker = broker;
        this.processFraudFileUsecase = processFraudFileUsecase;
        this.fetchFlaggedTransactionsUsecase = fetchFlaggedTransactionsUsecase;
    }
    async upload(file) {
        return this.broker.runUsecases([this.processFraudFileUsecase], { file });
    }
    async getFlagged(query) {
        return this.broker.runUsecases([this.fetchFlaggedTransactionsUsecase], query);
    }
};
exports.FraudController = FraudController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload JSON transaction file and detect fraud' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Fraud detection summary' }),
    (0, common_1.Post)('upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 500 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FraudController.prototype, "upload", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get flagged transactions (optionally filtered by userId)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated list of flagged transactions' }),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fraudCheck_dto_1.FetchFlaggedTransactionsDto]),
    __metadata("design:returntype", Promise)
], FraudController.prototype, "getFlagged", null);
exports.FraudController = FraudController = __decorate([
    (0, swagger_1.ApiTags)('Fraud Detection'),
    (0, common_1.Controller)('fraud-check'),
    __metadata("design:paramtypes", [broker_1.Broker,
        processFraudFile_usecase_1.ProcessFraudFileUsecase,
        fetchFlaggedTransactions_usecase_1.FetchFlaggedTransactionsUsecase])
], FraudController);
//# sourceMappingURL=fraud.controller.js.map