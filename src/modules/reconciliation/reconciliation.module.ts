import { Module } from '@nestjs/common';
import { ReconciliationController } from './controllers/reconciliation.controller';
import { ReconciliationService } from './services/reconciliation.service';
import { ReconcileFilesUsecase } from './usecases/reconcileFiles.usecase';

@Module({
  controllers: [ReconciliationController],
  providers: [ReconciliationService, ReconcileFilesUsecase],
})
export class ReconciliationModule {}
