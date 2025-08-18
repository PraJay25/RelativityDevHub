import { ApiProperty } from '@nestjs/swagger';
import { PartialType, OmitType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserRole, UserStatus } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be a valid user status' })
  status?: UserStatus;

  @ApiProperty({
    description: 'Whether user email is verified',
    required: false,
  })
  @IsOptional()
  emailVerified?: boolean;
}
