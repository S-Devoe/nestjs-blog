import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostStatus } from '../enums/post-status.enum';
import { PostType } from '../enums/post-type.enum';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
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
  featuredImage?: string;

  @IsOptional()
  @IsISO8601()
  @ApiPropertyOptional({
    description: 'The date the post was published',
    example: '2021-09-01T00:00:00.000Z',
  })
  publishedOn?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @ApiPropertyOptional({
    description: 'The tags of the post, minimum of 3 characters',
    example: ['tag1', 'tag2'],
  })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  @ApiPropertyOptional({
    description: 'The meta options of the post',
    type: 'array',
    isArray: true,
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'The key of the meta option',
          example: 'author',
        },
        value: {
          type: 'any',
          description: 'The value of the meta option',
          example: 'John Doe',
        },
      },
    },
    example: [
      {
        key: 'author',
        value: 'John Doe',
      },
    ],
  })
  metaOptions?: CreatePostMetaOptionsDto[];
}
