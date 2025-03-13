import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamsDto {
  @ApiPropertyOptional({
    description:
      'User ID, must be a number, if not provided, all users will be returned',
    example: 12345,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
