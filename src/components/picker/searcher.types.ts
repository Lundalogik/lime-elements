import { ListItem } from '@limetech/lime-elements';

export type Searcher = (query: string) => Promise<ListItem[]>;
