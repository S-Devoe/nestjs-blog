import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

export interface Paginated<T> {
  results: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    first: string;
    last: string;
    current: string;
    next: string;
    previous: string;
  };
}

export interface FindOptions<T> {
  relations?: FindOptionsRelations<T>;
  where?: FindOptionsWhere<T>;
  select?: FindOptionsSelect<T>;
  order?: FindOptionsOrder<T>;
}
