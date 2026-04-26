import { EntityManager } from 'typeorm';
export declare abstract class Usecase {
    abstract execute(entityManager: EntityManager, dto?: any): Promise<any>;
}
