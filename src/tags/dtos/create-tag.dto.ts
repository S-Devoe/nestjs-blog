import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'slug should be all small letter and uses hyphen "-" for space, e.g "my-post"',
  })
  @ApiProperty({
    description: 'The slug of the post',
    example: 'my-first',
  })
  @MaxLength(256)
  slug: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(256)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  schema?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  @ApiPropertyOptional()
  featuredImageUrl: string;
}
