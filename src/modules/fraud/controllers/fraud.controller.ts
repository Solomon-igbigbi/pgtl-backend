import {
  Controller,
  Post,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { Broker } from '../../../broker/broker';
import { ProcessFraudFileUsecase } from '../usecases/processFraudFile.usecase';
import { FetchFlaggedTransactionsUsecase } from '../usecases/fetchFlaggedTransactions.usecase';
import { FetchFlaggedTransactionsDto } from '../dtos/fraudCheck.dto';

@ApiTags('Fraud Detection')
@Controller('fraud-check')
export class FraudController {
  constructor(
    private readonly broker: Broker,
    private readonly processFraudFileUsecase: ProcessFraudFileUsecase,
    private readonly fetchFlaggedTransactionsUsecase: FetchFlaggedTransactionsUsecase,
  ) {}

  @ApiOperation({ summary: 'Upload JSON transaction file and detect fraud' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({ description: 'Fraud detection summary' })
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 500 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.broker.runUsecases([this.processFraudFileUsecase], { file });
  }

  @ApiOperation({ summary: 'Get flagged transactions (optionally filtered by userId)' })
  @ApiOkResponse({ description: 'Paginated list of flagged transactions' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getFlagged(@Query() query: FetchFlaggedTransactionsDto) {
    return this.broker.runUsecases([this.fetchFlaggedTransactionsUsecase], query);
  }
}
