import { ListItem } from '../../interface';

export type Searcher = (query: string) => Promise<ListItem[]>;
