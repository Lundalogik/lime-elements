/**
 * Layouts:
 * - default: resizes the table's columns, in a way that each column becomes as wide as the data it holds
 * - stretchLastColumn: works like default, but the last column is stretched to fill any remaining space
 * - stretchColumns: when there is extra space, the columns are stretched to fill it, otherwise, this works just like default
 * - lowDensity: converts the table into an airy list of items
 * @public
 */
export type Layout =
    | 'default'
    | 'stretchLastColumn'
    | 'stretchColumns'
    | 'lowDensity';

/**
 * Maps a layout to a Tabulator layout
 * @param layout - the layout to map
 * @returns the Tabulator layout
 * @internal
 */
export function mapLayout(layout: Layout) {
    const layouts = {
        stretchLastColumn: 'fitDataStretch',
        stretchColumns: 'fitColumns',
        lowDensity: 'fitData',
    };

    return layouts[layout] || 'fitDataFill';
}
