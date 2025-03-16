import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}
  public async createTag(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  public async findMultipleTags(tags: number[]) {
    const results = await this.tagRepository.find({
      where: {
        id: In(tags),
      },
    });
    return results;
  }

  public async deleteTag(id: number) {
    const tag = await this.tagRepository.findOneBy({ id });

    if (!tag) {
      throw Error('Tag not found');
    }

    await this.tagRepository.delete(id);

    return {
      deleted: true,
      id: 1,
    };
  }

  public async softDeleteTag(id: number) {
    const tag = await this.tagRepository.findOneBy({ id });

    if (!tag) {
      throw Error('Tag not found');
    }

    await this.tagRepository.softDelete(id);

    return {
      deleted: true,
      id: id,
    };
  }
}
