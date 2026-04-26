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
exports.FlaggedTransaction = exports.FraudType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../shared/repositories/base.entity");
var FraudType;
(function (FraudType) {
    FraudType["FREQUENCY"] = "FREQUENCY";
    FraudType["DAILY_LIMIT"] = "DAILY_LIMIT";
    FraudType["LOCATION_VELOCITY"] = "LOCATION_VELOCITY";
})(FraudType || (exports.FraudType = FraudType = {}));
let FlaggedTransaction = class FlaggedTransaction extends base_entity_1.BaseEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { transactionId: { required: true, type: () => String }, userId: { required: true, type: () => String }, amount: { required: true, type: () => Number }, timestamp: { required: true, type: () => Date }, merchant: { required: true, type: () => String }, location: { required: true, type: () => String }, fraudType: { required: true, enum: require("./flaggedTransaction.entity").FraudType } };
    }
};
exports.FlaggedTransaction = FlaggedTransaction;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], FlaggedTransaction.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], FlaggedTransaction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], FlaggedTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], FlaggedTransaction.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], FlaggedTransaction.prototype, "merchant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], FlaggedTransaction.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], FlaggedTransaction.prototype, "fraudType", void 0);
exports.FlaggedTransaction = FlaggedTransaction = __decorate([
    (0, typeorm_1.Entity)('flagged_transactions')
], FlaggedTransaction);
//# sourceMappingURL=flaggedTransaction.entity.js.map