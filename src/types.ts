import { SwissParlEntity } from 'swissparl/dist/models';

export interface Config {
  deepParse?: boolean;
  maxResults?: number;
}

export type FilterOptions<T> =
  | { eq: T[] }
  | { ne: T[] }
  | { gt: T[] }
  | { lt: T[] }
  | { ge: T[] }
  | { le: T[] }
  | { substringOf: T[] };

export interface QueryOptions<T extends SwissParlEntity> {
  filter?: FilterOptions<T>;
  expand?: Array<keyof T>;
  select?: Array<keyof T>;
  skip?: number;
  top?: number;
  orderby?: {
    property: keyof T;
    order?: 'asc' | 'desc';
  };
}
