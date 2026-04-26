import { Injectable } from '@nestjs/common';
import { FraudType } from '../../core/entities/flaggedTransaction.entity';
import { RawTransaction } from '../dtos/fraudCheck.dto';

interface FlaggedEntry {
  transactionId: string;
  userId: string;
  amount: number;
  timestamp: Date;
  merchant: string;
  location: string;
  fraudType: FraudType;
}

const FREQUENCY_WINDOW_MS = 60_000;
const FREQUENCY_THRESHOLD = 5;
const DAILY_LIMIT = 10_000;
const LOCATION_WINDOW_MS = 2 * 60_000;

@Injectable()
export class FraudDetectionService {
  detect(transactions: RawTransaction[]): FlaggedEntry[] {
    // Sliding deque per user: timestamps for frequency detection
    const frequencyDeques = new Map<string, number[]>();

    // Running daily totals: key = "userId:YYYY-MM-DD"
    const dailyTotals = new Map<string, number>();

    // Recent location window per user: [{location, ts}]
    const locationWindows = new Map<
      string,
      { location: string; ts: number }[]
    >();

    const flagged: FlaggedEntry[] = [];
    const flaggedIds = new Set<string>();

    const flag = (tx: RawTransaction, fraudType: FraudType) => {
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

      // --- Pattern 1: Frequency (>5 in 60s) ---
      if (!frequencyDeques.has(userId)) frequencyDeques.set(userId, []);
      const deque = frequencyDeques.get(userId)!;

      // evict timestamps outside 60s window
      while (deque.length && ts - deque[0] >= FREQUENCY_WINDOW_MS)
        deque.shift();
      deque.push(ts);
      if (deque.length > FREQUENCY_THRESHOLD) {
        flag(tx, FraudType.FREQUENCY);
      }

      // --- Pattern 2: Daily amount > $10,000 ---
      const prev = dailyTotals.get(dateKey) ?? 0;
      const newTotal = prev + Number(tx.amount);
      dailyTotals.set(dateKey, newTotal);

      if (newTotal > DAILY_LIMIT && prev <= DAILY_LIMIT) {
        // flag this crossing transaction
        flag(tx, FraudType.DAILY_LIMIT);
      } else if (prev > DAILY_LIMIT) {
        flag(tx, FraudType.DAILY_LIMIT);
      }

      // --- Pattern 3: Different location within 2 minutes ---
      if (!locationWindows.has(userId)) locationWindows.set(userId, []);
      const locWindow = locationWindows.get(userId)!;

      // evict entries outside 2-minute window
      const active = locWindow.filter((e) => ts - e.ts < LOCATION_WINDOW_MS);
      const differentLocation = active.some(
        (e) => e.location && tx.location && e.location !== tx.location,
      );
      if (differentLocation) {
        flag(tx, FraudType.LOCATION_VELOCITY);
      }
      active.push({ location: tx.location, ts });
      locationWindows.set(userId, active);
    }

    return flagged;
  }
}
