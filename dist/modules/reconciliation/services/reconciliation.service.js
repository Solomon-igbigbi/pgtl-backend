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
exports.ReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
let ReconciliationService = class ReconciliationService {
    async parseCsvBuffer(buffer) {
        return new Promise((resolve, reject) => {
            const map = new Map();
            const readable = stream_1.Readable.from([buffer]);
            readable
                .pipe((0, csv_parser_1.default)({
                mapHeaders: ({ header }) => header
                    .trim()
                    .replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
            }))
                .on('data', (row) => {
                const id = row.transactionId?.trim();
                if (id)
                    map.set(id, row);
            })
                .on('end', () => resolve(map))
                .on('error', reject);
        });
    }
    reconcile(mapA, mapB) {
        const missingInB = [];
        const missingInA = [];
        const amountMismatches = [];
        const statusMismatches = [];
        for (const [id, rowA] of mapA) {
            const rowB = mapB.get(id);
            if (!rowB) {
                missingInB.push({ transactionId: id, ...rowA });
                continue;
            }
            const amtA = parseFloat(rowA.amount);
            const amtB = parseFloat(rowB.amount);
            if (!isNaN(amtA) && !isNaN(amtB) && Math.abs(amtA - amtB) > 0.001) {
                amountMismatches.push({
                    transactionId: id,
                    amountInA: rowA.amount,
                    amountInB: rowB.amount,
                    currency: rowA.currency,
                });
            }
            if (rowA.status?.trim().toUpperCase() !== rowB.status?.trim().toUpperCase()) {
                statusMismatches.push({
                    transactionId: id,
                    statusInA: rowA.status,
                    statusInB: rowB.status,
                });
            }
        }
        for (const [id, rowB] of mapB) {
            if (!mapA.has(id)) {
                missingInA.push({ transactionId: id, ...rowB });
            }
        }
        return {
            summary: {
                totalInA: mapA.size,
                totalInB: mapB.size,
                missingInA: missingInA.length,
                missingInB: missingInB.length,
                amountMismatches: amountMismatches.length,
                statusMismatches: statusMismatches.length,
            },
            missingInA,
            missingInB,
            amountMismatches,
            statusMismatches,
        };
    }
    paginate(items, page, limit) {
        const start = (page - 1) * limit;
        return items.slice(start, start + limit);
    }
    validateFiles(fileA, fileB) {
        if (!fileA || !fileB) {
            throw new common_1.BadRequestException('Both fileA and fileB are required');
        }
        const allowed = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/octet-stream',
        ];
        const ext = (f) => f.originalname.toLowerCase().endsWith('.csv');
        if (!ext(fileA) || !ext(fileB)) {
            throw new common_1.BadRequestException('Both files must be CSV files');
        }
    }
};
exports.ReconciliationService = ReconciliationService;
exports.ReconciliationService = ReconciliationService = __decorate([
    (0, common_1.Injectable)()
], ReconciliationService);
//# sourceMappingURL=reconciliation.service.js.map