import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class RegisterDto extends CreateUserDto {
  @ApiProperty({
    description: 'Password confirmation',
    example: 'SecurePassword123!',
  })
  passwordConfirmation: string;
}
