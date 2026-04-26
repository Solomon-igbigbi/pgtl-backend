import { Broker } from '../../../broker/broker';
import { ProcessFraudFileUsecase } from '../usecases/processFraudFile.usecase';
import { FetchFlaggedTransactionsUsecase } from '../usecases/fetchFlaggedTransactions.usecase';
import { FetchFlaggedTransactionsDto } from '../dtos/fraudCheck.dto';
export declare class FraudController {
    private readonly broker;
    private readonly processFraudFileUsecase;
    private readonly fetchFlaggedTransactionsUsecase;
    constructor(broker: Broker, processFraudFileUsecase: ProcessFraudFileUsecase, fetchFlaggedTransactionsUsecase: FetchFlaggedTransactionsUsecase);
    upload(file: Express.Multer.File): Promise<any>;
    getFlagged(query: FetchFlaggedTransactionsDto): Promise<any>;
}
