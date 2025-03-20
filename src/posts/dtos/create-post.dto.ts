import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostStatus } from '../enums/post-status.enum';
import { PostType } from '../enums/post-type.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  @MaxLength(256)
  title: string;

  @IsEnum(PostType)
  @IsNotEmpty()
  @ApiProperty({
    description:
      "The type of the post, e.g. article, 'post','page','story','series' ",
    enum: PostType,
  })
  postType: PostType;

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

  @IsEnum(PostStatus)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The status of the post',
    enum: PostStatus,
  })
  status: PostStatus;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The content of the post',
    example: 'This is my first post',
  })
  content?: string;

  @IsOptional()
  @IsJSON()
  @ApiPropertyOptional({
    description:
      'Serialized JSON schema for the post else a validation error will be thrown',
    example:
      '{\r\n "@context": "https://schema.org",\r\n "@type":"Person"\r\n}',
  })
  schema?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    description: 'The featured image of the post',
    example: 'https://example.com/image.jpg',
  })
  @MaxLength(1024)
  featuredImage?: string;

  @IsOptional()
  @IsISO8601({
    strict: false,
    strictSeparator: false,
  })
  @ApiPropertyOptional({
    description: 'The date the post was published',
    example: '2021-09-01T00:00:00.000Z',
  })
  publishedOn?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  // @MinLength(3, { each: true })
  @ApiPropertyOptional({
    description: 'Array of id of tags',
    example: [1, 2],
  })
  tags?: number[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  @ApiPropertyOptional({
    description: 'The meta options of the post',
    required: false,
    type: CreatePostMetaOptionsDto,
    items: {
      type: 'object',
      properties: {
        metavalue: {
          type: 'json',
          description: 'The value of the meta option',
          example: '{ "author": "John Doe" }',
        },
      },
    },
  })
  metaOptions?: CreatePostMetaOptionsDto | null;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    type: 'integer',
    required: true,
    example: 1,
  })
  userId: number;
}
