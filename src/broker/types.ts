import { EntityManager } from 'typeorm';

export abstract class Usecase {
  abstract execute(entityManager: EntityManager, dto?: any): Promise<any>;
}
