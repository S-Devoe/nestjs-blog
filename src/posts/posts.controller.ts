import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('/{:userId}')
  public getPosts() {}

  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return createPostDto;
  }
}
