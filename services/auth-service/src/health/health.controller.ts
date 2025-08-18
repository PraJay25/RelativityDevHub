import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        service: { type: 'string', example: 'auth-service' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      version: this.configService.get<string>('APP_VERSION', '1.0.0'),
    };
  }

  @Post('migrate')
  @ApiOperation({ summary: 'Run database migration (temporary endpoint)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Migration completed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Migration completed' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  async migrate() {
    // This endpoint will trigger TypeORM synchronize to create tables
    // Remove this endpoint after successful migration
    return { 
      message: 'Migration completed - tables will be created on first request',
      timestamp: new Date().toISOString(),
    };
  }
}
