export declare class ReconcileQueryDto {
    page: number;
    limit: number;
}
export interface CsvRow {
    transactionId: string;
    timestamp: string;
    amount: string;
    currency: string;
    status: string;
}
export interface MissingTransaction {
    transactionId: string;
    timestamp: string;
    amount: string;
    currency: string;
    status: string;
}
export interface AmountMismatch {
    transactionId: string;
    amountInA: string;
    amountInB: string;
    currency: string;
}
export interface StatusMismatch {
    transactionId: string;
    statusInA: string;
    statusInB: string;
}
export interface ReconciliationSummary {
    totalInA: number;
    totalInB: number;
    missingInA: number;
    missingInB: number;
    amountMismatches: number;
    statusMismatches: number;
}
export declare class ReconciliationResultDto {
    summary: ReconciliationSummary;
    missingInA: MissingTransaction[];
    missingInB: MissingTransaction[];
    amountMismatches: AmountMismatch[];
    statusMismatches: StatusMismatch[];
    page: number;
    limit: number;
    totalPages: number;
}
