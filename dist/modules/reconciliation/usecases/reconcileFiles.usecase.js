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
exports.ReconcileFilesUsecase = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("../../../broker/types");
const reconciliation_service_1 = require("../services/reconciliation.service");
let ReconcileFilesUsecase = class ReconcileFilesUsecase extends types_1.Usecase {
    constructor(reconciliationService) {
        super();
        this.reconciliationService = reconciliationService;
    }
    async execute(_entityManager, dto) {
        const { fileA, fileB, page, limit } = dto;
        this.reconciliationService.validateFiles(fileA, fileB);
        const [mapA, mapB] = await Promise.all([
            this.reconciliationService.parseCsvBuffer(fileA.buffer),
            this.reconciliationService.parseCsvBuffer(fileB.buffer),
        ]);
        const result = this.reconciliationService.reconcile(mapA, mapB);
        const maxTotal = Math.max(result.missingInA.length, result.missingInB.length, result.amountMismatches.length, result.statusMismatches.length);
        const totalPages = Math.ceil(maxTotal / limit) || 1;
        return {
            summary: result.summary,
            missingInA: this.reconciliationService.paginate(result.missingInA, page, limit),
            missingInB: this.reconciliationService.paginate(result.missingInB, page, limit),
            amountMismatches: this.reconciliationService.paginate(result.amountMismatches, page, limit),
            statusMismatches: this.reconciliationService.paginate(result.statusMismatches, page, limit),
            page,
            limit,
            totalPages,
        };
    }
};
exports.ReconcileFilesUsecase = ReconcileFilesUsecase;
exports.ReconcileFilesUsecase = ReconcileFilesUsecase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reconciliation_service_1.ReconciliationService])
], ReconcileFilesUsecase);
//# sourceMappingURL=reconcileFiles.usecase.js.map