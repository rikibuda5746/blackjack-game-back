import { plainToInstance } from 'class-transformer';
import { PaginationResponseDto } from '@src/shared/dtos/pagination.response.dto';

export class PaginationTransformer {
  static toPaginationResponseDto<T>(
    data: T[],
    totalItems: number,
    skip: number,
    take: number,
  ): PaginationResponseDto<T>;

  static toPaginationResponseDto<D, T>(
    data: T[],
    totalItems: number,
    take: number,
    skip: number,
    transformer: (item: T) => D,
    withRelations?: boolean,
  ): PaginationResponseDto<D>;

  static toPaginationResponseDto<D, T>(
    data: T[],
    totalItems: number,
    take: number,
    skip: number,
    classType: new (...args: any[]) => D,
    withRelations?: boolean,
  ): PaginationResponseDto<D>;

  static toPaginationResponseDto<D, T>(
    data: T[],
    totalItems: number,
    take: number,
    skip: number,
    transformerOrClass?:
      | ((item: T, withRelations?: boolean) => D)
      | (new (...args: any[]) => D),
    withRelations?: boolean,
  ): PaginationResponseDto<T> | PaginationResponseDto<D> {
    const currentPage = Math.floor(skip / take) + 1;
    const totalPages = Math.ceil(totalItems / take);

    let transformedData: (T | D)[];

    if (
      typeof transformerOrClass === 'function' &&
      transformerOrClass.prototype
    ) {
      transformedData = plainToInstance(
        transformerOrClass as new (...args: any[]) => D,
        data,
        {
          exposeUnsetFields: false,
        },
      );
    } else if (typeof transformerOrClass === 'function') {
      transformedData = data.map((item) =>
        (transformerOrClass as (item: T, withRelations?: boolean) => D)(
          item,
          withRelations,
        ),
      );
    } else {
      transformedData = data;
    }

    return {
      data: transformedData as any[],
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage: take,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }
}
