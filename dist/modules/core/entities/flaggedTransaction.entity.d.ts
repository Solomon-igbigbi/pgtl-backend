import { BaseEntity } from '../../../shared/repositories/base.entity';
export declare enum FraudType {
    FREQUENCY = "FREQUENCY",
    DAILY_LIMIT = "DAILY_LIMIT",
    LOCATION_VELOCITY = "LOCATION_VELOCITY"
}
export declare class FlaggedTransaction extends BaseEntity {
    transactionId: string;
    userId: string;
    amount: number;
    timestamp: Date;
    merchant: string;
    location: string;
    fraudType: FraudType;
}
