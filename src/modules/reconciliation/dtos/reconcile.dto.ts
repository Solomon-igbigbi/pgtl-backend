import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ReconcileQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 50;
}

export interface CsvRow {
  transactionId: string;
  timestamp: string;
  amount: string;
  currency: string;
  status: string;
}

export interface MissingTransaction {
  transactionId: string;
  timestamp: string;
  amount: string;
  currency: string;
  status: string;
}

export interface AmountMismatch {
  transactionId: string;
  amountInA: string;
  amountInB: string;
  currency: string;
}

export interface StatusMismatch {
  transactionId: string;
  statusInA: string;
  statusInB: string;
}

export interface ReconciliationSummary {
  totalInA: number;
  totalInB: number;
  missingInA: number;
  missingInB: number;
  amountMismatches: number;
  statusMismatches: number;
}

export class ReconciliationResultDto {
  @ApiProperty()
  summary: ReconciliationSummary;

  @ApiProperty()
  missingInA: MissingTransaction[];

  @ApiProperty()
  missingInB: MissingTransaction[];

  @ApiProperty()
  amountMismatches: AmountMismatch[];

  @ApiProperty()
  statusMismatches: StatusMismatch[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
