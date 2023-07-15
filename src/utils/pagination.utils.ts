export type PaginationType = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  maxItemsPerPage: number;
};

export const defaultPagination: PaginationType = {
  currentPage: 1,
  itemsPerPage: 0,
  maxItemsPerPage: 0,
  totalItems: 0,
  totalPages: 1,
};
