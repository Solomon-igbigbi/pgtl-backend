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
exports.ReconciliationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const broker_1 = require("../../../broker/broker");
const reconcileFiles_usecase_1 = require("../usecases/reconcileFiles.usecase");
const reconcile_dto_1 = require("../dtos/reconcile.dto");
let ReconciliationController = class ReconciliationController {
    constructor(broker, reconcileFilesUsecase) {
        this.broker = broker;
        this.reconcileFilesUsecase = reconcileFilesUsecase;
    }
    async reconcile(files, query) {
        return this.broker.runUsecases([this.reconcileFilesUsecase], {
            fileA: files?.fileA?.[0],
            fileB: files?.fileB?.[0],
            page: query.page,
            limit: query.limit,
        });
    }
};
exports.ReconciliationController = ReconciliationController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reconcile two transaction CSV files' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['fileA', 'fileB'],
            properties: {
                fileA: { type: 'string', format: 'binary' },
                fileB: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Reconciliation results' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'fileA', maxCount: 1 },
        { name: 'fileB', maxCount: 1 },
    ], {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 500 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reconcile_dto_1.ReconcileQueryDto]),
    __metadata("design:returntype", Promise)
], ReconciliationController.prototype, "reconcile", null);
exports.ReconciliationController = ReconciliationController = __decorate([
    (0, swagger_1.ApiTags)('Reconciliation'),
    (0, common_1.Controller)('reconcile'),
    __metadata("design:paramtypes", [broker_1.Broker,
        reconcileFiles_usecase_1.ReconcileFilesUsecase])
], ReconciliationController);
//# sourceMappingURL=reconciliation.controller.js.map