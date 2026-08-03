export interface PageRequest {
  page: number;
  size: number;
  sort?: Sort[];
  filters?: Filter[];
}

export interface PageResponse<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface CursorRequest {
  cursor?: string;
  limit: number;
  sort?: Sort[];
  filters?: Filter[];
}

export interface CursorResponse<T> {
  data: T[];
  nextCursor?: string;
}

export interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface Filter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: any;
}
