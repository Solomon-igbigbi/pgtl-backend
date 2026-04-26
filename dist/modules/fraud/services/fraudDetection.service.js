"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudDetectionService = void 0;
const common_1 = require("@nestjs/common");
const flaggedTransaction_entity_1 = require("../../core/entities/flaggedTransaction.entity");
const FREQUENCY_WINDOW_MS = 60_000;
const FREQUENCY_THRESHOLD = 5;
const DAILY_LIMIT = 10_000;
const LOCATION_WINDOW_MS = 2 * 60_000;
let FraudDetectionService = class FraudDetectionService {
    detect(transactions) {
        const frequencyDeques = new Map();
        const dailyTotals = new Map();
        const locationWindows = new Map();
        const flagged = [];
        const flaggedIds = new Set();
        const flag = (tx, fraudType) => {
            const key = `${tx.transactionId}:${fraudType}`;
            if (!flaggedIds.has(key)) {
                flaggedIds.add(key);
                flagged.push({
                    transactionId: tx.transactionId,
                    userId: tx.userId,
                    amount: tx.amount,
                    timestamp: new Date(tx.timestamp),
                    merchant: tx.merchant,
                    location: tx.location,
                    fraudType,
                });
            }
        };
        for (const tx of transactions) {
            const ts = new Date(tx.timestamp).getTime();
            const userId = tx.userId;
            const dateKey = `${userId}:${new Date(tx.timestamp).toISOString().slice(0, 10)}`;
            if (!frequencyDeques.has(userId))
                frequencyDeques.set(userId, []);
            const deque = frequencyDeques.get(userId);
            while (deque.length && ts - deque[0] >= FREQUENCY_WINDOW_MS)
                deque.shift();
            deque.push(ts);
            if (deque.length > FREQUENCY_THRESHOLD) {
                flag(tx, flaggedTransaction_entity_1.FraudType.FREQUENCY);
            }
            const prev = dailyTotals.get(dateKey) ?? 0;
            const newTotal = prev + Number(tx.amount);
            dailyTotals.set(dateKey, newTotal);
            if (newTotal > DAILY_LIMIT && prev <= DAILY_LIMIT) {
                flag(tx, flaggedTransaction_entity_1.FraudType.DAILY_LIMIT);
            }
            else if (prev > DAILY_LIMIT) {
                flag(tx, flaggedTransaction_entity_1.FraudType.DAILY_LIMIT);
            }
            if (!locationWindows.has(userId))
                locationWindows.set(userId, []);
            const locWindow = locationWindows.get(userId);
            const active = locWindow.filter((e) => ts - e.ts < LOCATION_WINDOW_MS);
            const differentLocation = active.some((e) => e.location && tx.location && e.location !== tx.location);
            if (differentLocation) {
                flag(tx, flaggedTransaction_entity_1.FraudType.LOCATION_VELOCITY);
            }
            active.push({ location: tx.location, ts });
            locationWindows.set(userId, active);
        }
        return flagged;
    }
};
exports.FraudDetectionService = FraudDetectionService;
exports.FraudDetectionService = FraudDetectionService = __decorate([
    (0, common_1.Injectable)()
], FraudDetectionService);
//# sourceMappingURL=fraudDetection.service.js.map