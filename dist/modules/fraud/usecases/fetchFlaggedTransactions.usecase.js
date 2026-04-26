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
exports.FetchFlaggedTransactionsUsecase = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("../../../broker/types");
const fraud_service_1 = require("../services/fraud.service");
let FetchFlaggedTransactionsUsecase = class FetchFlaggedTransactionsUsecase extends types_1.Usecase {
    constructor(fraudService) {
        super();
        this.fraudService = fraudService;
    }
    async execute(_entityManager, dto) {
        return this.fraudService.fetchFlagged(dto);
    }
};
exports.FetchFlaggedTransactionsUsecase = FetchFlaggedTransactionsUsecase;
exports.FetchFlaggedTransactionsUsecase = FetchFlaggedTransactionsUsecase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fraud_service_1.FraudService])
], FetchFlaggedTransactionsUsecase);
//# sourceMappingURL=fetchFlaggedTransactions.usecase.js.map