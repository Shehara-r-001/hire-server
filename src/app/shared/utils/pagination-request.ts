import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationRequest {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Type(() => Number)
  pageSize = 10;

  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsString()
  @IsEnum(SortType)
  sortType: SortType = SortType.ASC;

  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  filters: string;

  // constructor(
  //   page = 1,
  //   pageSize = 10,
  //   sortBy = '',
  //   sortType: SortType = SortType.ASC,
  //   query = '',
  //   filters = ''
  // ) {
  //   this.page = page;
  //   this.pageSize = pageSize;
  //   this.sortBy = sortBy;
  //   this.sortType = sortType;
  //   this.query = query;
  //   this.filters = filters;
  // }
}
