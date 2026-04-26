import { Broker } from '../../../broker/broker';
import { ReconcileFilesUsecase } from '../usecases/reconcileFiles.usecase';
import { ReconcileQueryDto } from '../dtos/reconcile.dto';
export declare class ReconciliationController {
    private readonly broker;
    private readonly reconcileFilesUsecase;
    constructor(broker: Broker, reconcileFilesUsecase: ReconcileFilesUsecase);
    reconcile(files: {
        fileA?: Express.Multer.File[];
        fileB?: Express.Multer.File[];
    }, query: ReconcileQueryDto): Promise<any>;
}
