import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    /**
     * Inject post repository
     */
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    /**
     * Inject metaOption repository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
    /**
     * Inject Tag service
     */
    private readonly tagsService: TagsService,
  ) {}
  /**
   * Create new post
   */
  public async createPost(@Body() createPostDto: CreatePostDto) {
    const user = await this.usersService.getUserById(createPostDto.userId);
    //find tags

    const tags = await this.tagsService.findMultipleTags(
      createPostDto.tags || [],
    );

    //create the post
    const post = this.postRepository.create({
      ...createPostDto,
      user: user!,
      tags: tags,
    });

    //save the post
    return await this.postRepository.save(post);
  }

  /**
   * Get all posts
   */
  public async getPosts(userId: string) {
    const posts = await this.postRepository.find({
      relations: {
        metaOptions: true,
        user: true,
        // tags: true, // i decided to use eager loading for this
      },
    });
    return posts;
  }

  public async deletePost(id: number) {
    const post = await this.postRepository.findOneBy({ id });

    await this.postRepository.delete(id);

    return {
      deleted: true,
      id: 1,
    };
  }

  public async updatePost(patchPostDto: PatchPostDto) {
    // find the tags
    const tags = await this.tagsService.findMultipleTags(
      patchPostDto.tags || [],
    );
    // find the posts
    const posts = await this.postRepository.findOneBy({ id: patchPostDto.id });

    if (!posts) {
      throw new Error('Post not found');
    }

    // update the properties of the post
    posts.title = patchPostDto?.title ?? posts?.title;
    posts.content = patchPostDto.content ?? posts?.content;
    posts.slug = patchPostDto.slug ?? posts?.slug;
    posts.status = patchPostDto.status ?? posts?.status;
    posts.postType = patchPostDto.postType ?? posts?.postType;
    posts.featuredImage = patchPostDto.featuredImage ?? posts?.featuredImage;
    posts.publishedOn = patchPostDto.publishedOn ?? posts?.publishedOn;

    //update the new tags
    posts.tags = tags;

    //save the post and return
    return await this.postRepository.save(posts);
  }
}
