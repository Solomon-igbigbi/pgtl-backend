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
export declare class FraudDetectionService {
    detect(transactions: RawTransaction[]): FlaggedEntry[];
}
export {};
