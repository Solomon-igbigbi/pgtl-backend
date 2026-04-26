import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraudController } from './controllers/fraud.controller';
import { FraudService } from './services/fraud.service';
import { FraudDetectionService } from './services/fraudDetection.service';
import { ProcessFraudFileUsecase } from './usecases/processFraudFile.usecase';
import { FetchFlaggedTransactionsUsecase } from './usecases/fetchFlaggedTransactions.usecase';
import { FlaggedTransactionRepository } from '../../adapters/repositories/flaggedTransaction.repository';
import { FlaggedTransaction } from '../core/entities/flaggedTransaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlaggedTransaction])],
  controllers: [FraudController],
  providers: [
    FraudService,
    FraudDetectionService,
    ProcessFraudFileUsecase,
    FetchFlaggedTransactionsUsecase,
    FlaggedTransactionRepository,
  ],
})
export class FraudModule {}
