export declare class FetchFlaggedTransactionsDto {
    userId?: string;
    page: number;
    limit: number;
}
export interface RawTransaction {
    transactionId: string;
    userId: string;
    amount: number;
    timestamp: string;
    merchant: string;
    location: string;
}
