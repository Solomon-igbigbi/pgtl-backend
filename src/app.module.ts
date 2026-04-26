import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import commonConfig from './configs/common.config';
import { validationSchema } from './configs/schema.config';
import { SnakeCaseNamingStrategy } from './shared/repositories/snakeCaseNaming.strategy';
import { BrokerModule } from './broker/broker.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { FraudModule } from './modules/fraud/fraud.module';
import { FlaggedTransaction } from './modules/core/entities/flaggedTransaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [commonConfig],
      validationSchema,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('common.database.host'),
        port: config.get<number>('common.database.port'),
        username: config.get('common.database.username'),
        password: config.get('common.database.password'),
        database: config.get('common.database.name'),
        entities: [FlaggedTransaction],
        synchronize: config.get('common.nodeEnv') !== 'production',
        namingStrategy: new SnakeCaseNamingStrategy(),
      }),
    }),
    BrokerModule,
    ReconciliationModule,
    FraudModule,
  ],
})
export class AppModule {}
