import { ArrayCursor } from 'arangojs/cursor';

export interface Vertices {
  collection_name: string;
  start_vertex_id: string[];
}

export enum SortOrder {
  UNSORTED = 0,
  ASCENDING = 1,
  DESCENDING = 2,
};

export interface Sort {
  field: string;
  order: SortOrder;
}

export interface Collection {
  collection_name: string;
  limit?: number;
  offset?: number;
  sort?: Sort[];
}

export interface TraversalOptions {
  include_vertex?: string[];
  exclude_vertex?: string[];
  include_edge?: string[];
  exclude_edge?: string[];
  direction?: string;
};

export enum FilterOperation {
  eq = 0,
  lt = 1,
  lte = 2,
  gt = 3,
  gte = 4,
  isEmpty = 5,
  iLike = 6,
  in = 7,
  neq = 8
};

export enum FilterValueType {
  STRING = 0,
  NUMBER = 1,
  BOOLEAN = 2,
  DATE = 3,
  ARRAY = 4,
};

export enum OperatorType {
  and = 0,
  or = 1,
};

export interface GraphFilter {
  field: string;
  operation: FilterOperation;
  value: string;
  type?: FilterValueType; // defaults to string data type if not provided
  filters?: GraphFilters[];
}

export interface GraphFilters {
  entity?: string;
  edge?: string;
  filter?: GraphFilter[];
  operator?: OperatorType;
}

export interface TraversalResponse {
  rootCursor?: ArrayCursor;
  associationCursor?: ArrayCursor;
}