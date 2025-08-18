import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET', 'your-super-secret-jwt-key'),
      signOptions: {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '24h'),
      },
    };
  }
}
