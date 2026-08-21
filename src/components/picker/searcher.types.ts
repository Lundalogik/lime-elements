import { ListSeparator } from '../../global/shared-types/separator.types';
import { PickerItem } from './picker-item.types';

/**
 * A search function that takes a search-string as an argument, and returns
 * a promise that will eventually be resolved with an array of `PickerItem`:s.
 *
 * When the picker is `multiple`, it removes items that are already
 * picked from the result before showing it, matched by value id against
 * the picker's `value`. The searcher does not need to filter them out
 * itself. Items with no value at all have no id to match on, so those
 * are always kept.
 *
 * @param query - A search query. Typically what the user has written
 * in the input field of a limel-picker.
 * @returns The search result.
 * @public
 */
export type Searcher = (
    query: string
) => Promise<Array<PickerItem | ListSeparator>>;
