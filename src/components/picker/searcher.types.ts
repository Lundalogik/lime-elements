import { ListSeparator } from '../../global/shared-types/separator.types';
import { PickerItem } from './picker-item.types';

/**
 * A search function that takes a search-string as an argument, and returns
 * a promise that will eventually be resolved with an array of `PickerItem`:s.
 *
 * When the picker is `multiple`, items that are already picked are removed
 * from the result before it is shown, matched by value id. The searcher
 * does not need to filter them out itself — but it happens *after* the
 * searcher returns, so a searcher that returns a fixed page can hand back
 * a page that is short, or empty, once enough of it has been picked.
 * Account for the picked items when paging if that matters.
 *
 * @param query - A search query. Typically what the user has written
 * in the input field of a limel-picker.
 * @returns The search result.
 * @public
 */
export type Searcher = (
    query: string
) => Promise<Array<PickerItem | ListSeparator>>;
