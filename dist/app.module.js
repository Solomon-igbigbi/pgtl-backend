"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const common_config_1 = __importDefault(require("./configs/common.config"));
const schema_config_1 = require("./configs/schema.config");
const snakeCaseNaming_strategy_1 = require("./shared/repositories/snakeCaseNaming.strategy");
const broker_module_1 = require("./broker/broker.module");
const reconciliation_module_1 = require("./modules/reconciliation/reconciliation.module");
const fraud_module_1 = require("./modules/fraud/fraud.module");
const flaggedTransaction_entity_1 = require("./modules/core/entities/flaggedTransaction.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [common_config_1.default],
                validationSchema: schema_config_1.validationSchema,
                envFilePath: ['.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('common.database.host'),
                    port: config.get('common.database.port'),
                    username: config.get('common.database.username'),
                    password: config.get('common.database.password'),
                    database: config.get('common.database.name'),
                    entities: [flaggedTransaction_entity_1.FlaggedTransaction],
                    synchronize: config.get('common.nodeEnv') !== 'production',
                    namingStrategy: new snakeCaseNaming_strategy_1.SnakeCaseNamingStrategy(),
                }),
            }),
            broker_module_1.BrokerModule,
            reconciliation_module_1.ReconciliationModule,
            fraud_module_1.FraudModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map