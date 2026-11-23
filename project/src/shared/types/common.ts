import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
 
export type Id = string;
 
export type ISODate = string;
 
export interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}
 
export type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };
 
export type IconName = ComponentProps<typeof Ionicons>['name'];

