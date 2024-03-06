import { ListItem } from '../list/list-item.types';
import { ListSeparator } from '../../global/shared-types/separator.types';

/**
 * A search function that takes a search-string as an argument, and returns
 * a promise that will eventually be resolved with an array of `ListItem`:s.
 *
 * @param query - A search query. Typically what the user has written
 * in the input field of a limel-picker.
 * @returns The search result.
 * @public
 */
export type Searcher = (
    query: string,
) => Promise<Array<ListItem | ListSeparator>>;
