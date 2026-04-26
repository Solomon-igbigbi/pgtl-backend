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
exports.ReconciliationResultDto = exports.ReconcileQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ReconcileQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 50;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: true, type: () => Number, default: 1, minimum: 1 }, limit: { required: true, type: () => Number, default: 50, minimum: 1 } };
    }
}
exports.ReconcileQueryDto = ReconcileQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReconcileQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReconcileQueryDto.prototype, "limit", void 0);
class ReconciliationResultDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { summary: { required: true, type: () => Object }, missingInA: { required: true, type: () => [Object] }, missingInB: { required: true, type: () => [Object] }, amountMismatches: { required: true, type: () => [Object] }, statusMismatches: { required: true, type: () => [Object] }, page: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number } };
    }
}
exports.ReconciliationResultDto = ReconciliationResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ReconciliationResultDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ReconciliationResultDto.prototype, "missingInA", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ReconciliationResultDto.prototype, "missingInB", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ReconciliationResultDto.prototype, "amountMismatches", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ReconciliationResultDto.prototype, "statusMismatches", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReconciliationResultDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReconciliationResultDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReconciliationResultDto.prototype, "totalPages", void 0);
//# sourceMappingURL=reconcile.dto.js.map