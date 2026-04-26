import { Global, Module } from '@nestjs/common';
import { Broker } from './broker';

@Global()
@Module({
  providers: [Broker],
  exports: [Broker],
})
export class BrokerModule {}
