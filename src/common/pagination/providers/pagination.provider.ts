import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { FindOptions, Paginated } from '../interfaces/paginated.interface';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class PaginationProvider {
  constructor(
    /**
     * Inject Request
     */
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginatedQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
    options?: FindOptions<T>,
  ): Promise<Paginated<T>> {
    const results = await repository.find({
      take: paginationQuery.limit,
      skip: (paginationQuery.page! - 1) * paginationQuery.limit!,
      ...options,
    });

    /**
     * request urls
     */
    const baseUrl = `${this.request.protocol}://${this.request.headers.host}/`;
    const newUrl = new URL(this.request.url, baseUrl);

    const totalItems = await repository.count({
      where: options?.where,
    });
    const totalPages = Math.ceil(totalItems / paginationQuery.limit!);
    const currentPage = paginationQuery.page!;
    const itemsPerPage = paginationQuery.limit!;

    const nextPage =
      paginationQuery.page! === totalPages
        ? paginationQuery.page
        : paginationQuery.page! + 1;

    const previousPage =
      paginationQuery.page! === 1
        ? paginationQuery.page
        : paginationQuery.page! - 1;

    const finalResponse: Paginated<T> = {
      results: results,
      meta: {
        currentPage: currentPage,
        totalItems: totalItems,
        totalPages: totalPages,
        itemsPerPage: itemsPerPage,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${paginationQuery.limit}`,
        last: `${newUrl.origin}${newUrl.pathname}?page=${totalPages}&limit=${paginationQuery.limit}`,
        current: `${newUrl.origin}${newUrl.pathname}?page=${paginationQuery.page}&limit=${paginationQuery.limit}`,
        next: `${newUrl.origin}${newUrl.pathname}?page=${nextPage}&limit=${paginationQuery.limit}`,
        previous: `${newUrl.origin}${newUrl.pathname}?page=${previousPage}&limit=${paginationQuery.limit}`,
      },
    };

    return finalResponse;
  }
}
