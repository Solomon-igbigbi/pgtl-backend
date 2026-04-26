import { DataSource } from 'typeorm';
import { Usecase } from './types';
export declare class Broker {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    runUsecases(usecases: Usecase[], dto?: any): Promise<any>;
}
