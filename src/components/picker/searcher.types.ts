import { ListSeparator } from '../../global/shared-types/separator.types';
import { PickerItem } from './picker-item.types';

/**
 * A search function that takes a search-string as an argument, and returns
 * a promise that will eventually be resolved with an array of `PickerItem`:s.
 *
 * When the picker is `multiple`, items that are already picked are removed
 * from the result before it is shown, matched by value id, so the searcher
 * does not need to filter them out itself.
 *
 * The removal happens after the searcher returns, and the searcher is not
 * told what is already picked. A searcher that returns a fixed page can
 * therefore hand back a page that is short, or empty, once enough of that
 * page has been picked; returning more than one page's worth avoids it.
 *
 * @param query - A search query. Typically what the user has written
 * in the input field of a limel-picker.
 * @returns The search result.
 * @public
 */
export type Searcher = (
    query: string
) => Promise<Array<PickerItem | ListSeparator>>;
