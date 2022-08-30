export type Layout =
    | 'default'
    | 'stretchLastColumn'
    | 'stretchColumns'
    | 'lowDensity';

export function mapLayout(layout: Layout) {
    const layouts = {
        stretchLastColumn: 'fitDataStretch',
        stretchColumns: 'fitColumns',
        lowDensity: 'fitData',
    };

    return layouts[layout] || 'fitDataFill';
}
