import { ListSeparator } from '../../global/shared-types/separator.types';
import { PickerItem } from './picker-item.types';

/**
 * A search function that takes a search-string as an argument, and returns
 * a promise that will eventually be resolved with an array of `PickerItem`:s.
 *
 * @param query - A search query. Typically what the user has written
 * in the input field of a limel-picker.
 * @returns The search result.
 * @public
 */
export type Searcher = (
    query: string
) => Promise<Array<PickerItem | ListSeparator>>;
