import { CsvRow, MissingTransaction, AmountMismatch, StatusMismatch, ReconciliationSummary } from '../dtos/reconcile.dto';
export declare class ReconciliationService {
    parseCsvBuffer(buffer: Buffer): Promise<Map<string, CsvRow>>;
    reconcile(mapA: Map<string, CsvRow>, mapB: Map<string, CsvRow>): {
        summary: ReconciliationSummary;
        missingInA: MissingTransaction[];
        missingInB: MissingTransaction[];
        amountMismatches: AmountMismatch[];
        statusMismatches: StatusMismatch[];
    };
    paginate<T>(items: T[], page: number, limit: number): T[];
    validateFiles(fileA: Express.Multer.File, fileB: Express.Multer.File): void;
}
