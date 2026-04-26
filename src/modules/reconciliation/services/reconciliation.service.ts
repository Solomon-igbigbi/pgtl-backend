import { Injectable, BadRequestException } from '@nestjs/common';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import {
  CsvRow,
  MissingTransaction,
  AmountMismatch,
  StatusMismatch,
  ReconciliationSummary,
} from '../dtos/reconcile.dto';

@Injectable()
export class ReconciliationService {
  async parseCsvBuffer(buffer: Buffer): Promise<Map<string, CsvRow>> {
    return new Promise((resolve, reject) => {
      const map = new Map<string, CsvRow>();
      const readable = Readable.from([buffer]);

      readable
        .pipe(
          csvParser({
            mapHeaders: ({ header }) =>
              header
                .trim()
                .replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
          }),
        )
        .on('data', (row: CsvRow) => {
          const id = row.transactionId?.trim();
          if (id) map.set(id, row);
        })
        .on('end', () => resolve(map))
        .on('error', reject);
    });
  }

  reconcile(
    mapA: Map<string, CsvRow>,
    mapB: Map<string, CsvRow>,
  ): {
    summary: ReconciliationSummary;
    missingInA: MissingTransaction[];
    missingInB: MissingTransaction[];
    amountMismatches: AmountMismatch[];
    statusMismatches: StatusMismatch[];
  } {
    const missingInB: MissingTransaction[] = [];
    const missingInA: MissingTransaction[] = [];
    const amountMismatches: AmountMismatch[] = [];
    const statusMismatches: StatusMismatch[] = [];

    for (const [id, rowA] of mapA) {
      const rowB = mapB.get(id);
      if (!rowB) {
        missingInB.push({ transactionId: id, ...rowA });
        continue;
      }
      const amtA = parseFloat(rowA.amount);
      const amtB = parseFloat(rowB.amount);
      if (!isNaN(amtA) && !isNaN(amtB) && Math.abs(amtA - amtB) > 0.001) {
        amountMismatches.push({
          transactionId: id,
          amountInA: rowA.amount,
          amountInB: rowB.amount,
          currency: rowA.currency,
        });
      }
      if (
        rowA.status?.trim().toUpperCase() !== rowB.status?.trim().toUpperCase()
      ) {
        statusMismatches.push({
          transactionId: id,
          statusInA: rowA.status,
          statusInB: rowB.status,
        });
      }
    }

    for (const [id, rowB] of mapB) {
      if (!mapA.has(id)) {
        missingInA.push({ transactionId: id, ...rowB });
      }
    }

    return {
      summary: {
        totalInA: mapA.size,
        totalInB: mapB.size,
        missingInA: missingInA.length,
        missingInB: missingInB.length,
        amountMismatches: amountMismatches.length,
        statusMismatches: statusMismatches.length,
      },
      missingInA,
      missingInB,
      amountMismatches,
      statusMismatches,
    };
  }

  paginate<T>(items: T[], page: number, limit: number): T[] {
    const start = (page - 1) * limit;
    return items.slice(start, start + limit);
  }

  validateFiles(fileA: Express.Multer.File, fileB: Express.Multer.File): void {
    if (!fileA || !fileB) {
      throw new BadRequestException('Both fileA and fileB are required');
    }
    const allowed = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/octet-stream',
    ];
    const ext = (f: Express.Multer.File) =>
      f.originalname.toLowerCase().endsWith('.csv');
    if (!ext(fileA) || !ext(fileB)) {
      throw new BadRequestException('Both files must be CSV files');
    }
  }
}
