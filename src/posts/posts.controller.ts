import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('/{:userId}')
  public getPosts() {}

  @ApiOperation({
    summary: 'Create a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'Post created sucessfully',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return createPostDto;
  }

  @Patch()
  public patchPost(@Body() patchPostDto: PatchPostDto) {
    return patchPostDto;
  }
}
