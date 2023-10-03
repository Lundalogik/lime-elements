import { ListItem } from '../../interface';

/**
 * A search function that takes a search-string as an argument, and returns
 * a promise that will eventually be resolved with an array of `ListItem`:s.
 * @param {string} query A search query. Typically what the user has written
 * in the input field of a limel-picker.
 * @returns {Promise<ListItem[]>} The search result.
 */
export type Searcher = (query: string) => Promise<ListItem[]>;
