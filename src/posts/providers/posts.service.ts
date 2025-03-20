import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsDto } from '../dtos/get-post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';

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

    /**
     * Inject PaginationProvider
     */
    private readonly paginationProvider: PaginationProvider,
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
      user: user,
      tags: tags,
    });

    try {
      //save the post
      await this.postRepository.save(post);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while saving post: ${error}`,
      );
    }

    return post;
  }

  /**
   * Get all posts
   */
  public async getPosts(userId: string, postQuery: GetPostsDto) {
    const whereCondition = userId ? { user: { id: Number(userId) } } : {};

    const posts = await this.paginationProvider.paginatedQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },

      this.postRepository,
      {
        relations: {
          metaOptions: true,
          user: true,
        },
        where: whereCondition,
      },
    );

    return posts;
  }

  public async deletePost(id: number) {
    await this.postRepository.findOneBy({ id });

    await this.postRepository.delete(id);

    return {
      deleted: true,
      id: 1,
    };
  }

  public async updatePost(patchPostDto: PatchPostDto) {
    let tags: Tag[];
    let posts: Post | null;
    // find the tags
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags || []);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while checking tags: ${error}`,
      );
    }

    /**
     * Number of tags needs to be equal
     */
    if (!tags || tags.length !== patchPostDto?.tags?.length) {
      throw new BadRequestException(
        'Some tags were not found, please check your tags id and ensure they are correct',
      );
    }

    // find the posts
    try {
      posts = await this.postRepository.findOneBy({ id: patchPostDto.id });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while checking post; ${error}`,
      );
    }

    if (!posts) {
      throw new BadRequestException(
        `Post with id ${patchPostDto.id} not found`,
      );
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
