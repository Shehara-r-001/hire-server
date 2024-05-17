import { PaginationRequest } from './pagination-request';

export class PaginatedResponse<T> extends PaginationRequest {
  constructor(list: T[], itemCount: number, request?: PaginationRequest) {
    super();
    if (request) {
      this.page = request.page;
      this.pageSize = request.pageSize;
    }
    this.list = list;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.pageSize);
  }

  list: T[];

  itemCount: number;

  pageCount: number;

  get hasNextPage(): boolean {
    return this.page < this.pageCount;
  }

  get hasPreviousPage(): boolean {
    return this.page > 1;
  }
}
