"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fraud_controller_1 = require("./controllers/fraud.controller");
const fraud_service_1 = require("./services/fraud.service");
const fraudDetection_service_1 = require("./services/fraudDetection.service");
const processFraudFile_usecase_1 = require("./usecases/processFraudFile.usecase");
const fetchFlaggedTransactions_usecase_1 = require("./usecases/fetchFlaggedTransactions.usecase");
const flaggedTransaction_repository_1 = require("../../adapters/repositories/flaggedTransaction.repository");
const flaggedTransaction_entity_1 = require("../core/entities/flaggedTransaction.entity");
let FraudModule = class FraudModule {
};
exports.FraudModule = FraudModule;
exports.FraudModule = FraudModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([flaggedTransaction_entity_1.FlaggedTransaction])],
        controllers: [fraud_controller_1.FraudController],
        providers: [
            fraud_service_1.FraudService,
            fraudDetection_service_1.FraudDetectionService,
            processFraudFile_usecase_1.ProcessFraudFileUsecase,
            fetchFlaggedTransactions_usecase_1.FetchFlaggedTransactionsUsecase,
            flaggedTransaction_repository_1.FlaggedTransactionRepository,
        ],
    })
], FraudModule);
//# sourceMappingURL=fraud.module.js.map