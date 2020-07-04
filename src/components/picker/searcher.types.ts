import { ListItem } from '../list/list-item.types';

export type Searcher = (query: string) => Promise<ListItem[]>;
