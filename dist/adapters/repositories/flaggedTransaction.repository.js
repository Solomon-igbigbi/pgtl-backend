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
exports.FlaggedTransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const flaggedTransaction_entity_1 = require("../../modules/core/entities/flaggedTransaction.entity");
let FlaggedTransactionRepository = class FlaggedTransactionRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(flaggedTransaction_entity_1.FlaggedTransaction, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async bulkInsert(records, entityManager) {
        const CHUNK = 500;
        for (let i = 0; i < records.length; i += CHUNK) {
            await entityManager.insert(flaggedTransaction_entity_1.FlaggedTransaction, records.slice(i, i + CHUNK));
        }
        return records;
    }
    async findFlagged(dto) {
        const qb = this.createQueryBuilder('ft').orderBy('ft.timestamp', 'DESC');
        if (dto.userId) {
            qb.where('ft.userId = :userId', { userId: dto.userId });
        }
        const total = await qb.getCount();
        const items = await qb
            .skip((dto.page - 1) * dto.limit)
            .take(dto.limit)
            .getMany();
        return {
            items,
            total,
            page: dto.page,
            limit: dto.limit,
            totalPages: Math.ceil(total / dto.limit) || 1,
        };
    }
};
exports.FlaggedTransactionRepository = FlaggedTransactionRepository;
exports.FlaggedTransactionRepository = FlaggedTransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], FlaggedTransactionRepository);
//# sourceMappingURL=flaggedTransaction.repository.js.map