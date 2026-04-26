import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/repositories/base.entity';

export enum FraudType {
  FREQUENCY = 'FREQUENCY',
  DAILY_LIMIT = 'DAILY_LIMIT',
  LOCATION_VELOCITY = 'LOCATION_VELOCITY',
}

@Entity('flagged_transactions')
export class FlaggedTransaction extends BaseEntity {
  @Column({ type: 'varchar' })
  transactionId: string;

  @Index()
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'varchar', nullable: true })
  merchant: string;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar' })
  fraudType: FraudType;
}
