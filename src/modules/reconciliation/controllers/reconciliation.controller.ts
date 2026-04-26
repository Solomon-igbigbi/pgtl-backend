import {
  Controller,
  Post,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { Broker } from '../../../broker/broker';
import { ReconcileFilesUsecase } from '../usecases/reconcileFiles.usecase';
import { ReconcileQueryDto } from '../dtos/reconcile.dto';

@ApiTags('Reconciliation')
@Controller('reconcile')
export class ReconciliationController {
  constructor(
    private readonly broker: Broker,
    private readonly reconcileFilesUsecase: ReconcileFilesUsecase,
  ) {}

  @ApiOperation({ summary: 'Reconcile two transaction CSV files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['fileA', 'fileB'],
      properties: {
        fileA: { type: 'string', format: 'binary' },
        fileB: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({ description: 'Reconciliation results' })
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'fileA', maxCount: 1 },
        { name: 'fileB', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: 500 * 1024 * 1024 },
      },
    ),
  )
  async reconcile(
    @UploadedFiles() files: { fileA?: Express.Multer.File[]; fileB?: Express.Multer.File[] },
    @Query() query: ReconcileQueryDto,
  ) {
    return this.broker.runUsecases([this.reconcileFilesUsecase], {
      fileA: files?.fileA?.[0],
      fileB: files?.fileB?.[0],
      page: query.page,
      limit: query.limit,
    });
  }
}
