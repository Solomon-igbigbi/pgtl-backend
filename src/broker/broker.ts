import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Usecase } from './types';

@Injectable()
export class Broker {
  constructor(private readonly dataSource: DataSource) {}

  async runUsecases(usecases: Usecase[], dto?: any): Promise<any> {
    return this.dataSource.transaction(async (entityManager) => {
      let result: any = {};
      for (const usecase of usecases) {
        const output = await usecase.execute(entityManager, dto);
        if (output && typeof output === 'object') {
          result = { ...result, ...output };
        } else if (output !== undefined) {
          result = output;
        }
      }
      return result;
    });
  }
}
