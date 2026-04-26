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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessFraudFileUsecase = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("../../../broker/types");
const fraud_service_1 = require("../services/fraud.service");
const fraudDetection_service_1 = require("../services/fraudDetection.service");
let ProcessFraudFileUsecase = class ProcessFraudFileUsecase extends types_1.Usecase {
    constructor(fraudService, fraudDetectionService) {
        super();
        this.fraudService = fraudService;
        this.fraudDetectionService = fraudDetectionService;
    }
    async execute(entityManager, dto) {
        const { file } = dto;
        if (!file)
            throw new common_1.BadRequestException('JSON file is required');
        const transactions = this.fraudService.parseJsonBuffer(file.buffer);
        const flagged = this.fraudDetectionService.detect(transactions);
        const saved = await this.fraudService.saveFlagged(flagged, entityManager);
        const byType = flagged.reduce((acc, f) => {
            acc[f.fraudType] = (acc[f.fraudType] ?? 0) + 1;
            return acc;
        }, {});
        return {
            totalTransactions: transactions.length,
            totalFlagged: saved.length,
            byType,
        };
    }
};
exports.ProcessFraudFileUsecase = ProcessFraudFileUsecase;
exports.ProcessFraudFileUsecase = ProcessFraudFileUsecase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fraud_service_1.FraudService,
        fraudDetection_service_1.FraudDetectionService])
], ProcessFraudFileUsecase);
//# sourceMappingURL=processFraudFile.usecase.js.map