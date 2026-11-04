import { ChartItem, ChartSeries } from './chart.types';

/**
 * Series lined up by category, so that the items of each series that belong
 * together are at the same place.
 */
export interface SeriesGrid {
    /** The texts of the categories, in the order they first appear. */
    categories: string[];
    series: GridSeries[];
}

/**
 * A series whose items are lined up by category.
 */
export interface GridSeries {
    text: string;
    color?: string;
    /** The item of the series at each category, if it has one there. */
    items: Array<ChartItem | undefined>;
}

/**
 * Where an item is: the index of its series, and of its category. An item of
 * a chart without series is in the first and only series.
 */
export interface ItemPosition {
    series: number;
    index: number;
}

/**
 * Lines up the items of the series by their text, since items of different
 * series that have the same text belong to the same category. When a series
 * has several items with the same text, its second item with that text lines
 * up with the second one of the other series, and so on.
 * @param series - the series
 */
export function alignSeries(series: ChartSeries[]): SeriesGrid {
    const categories: string[] = [];
    const placesOfTexts = new Map<string, number[]>();
    const placedSeries = series.map((current) => {
        const timesSeen = new Map<string, number>();

        return (current.items ?? []).map((item) => {
            const occurrence = timesSeen.get(item.text) ?? 0;
            timesSeen.set(item.text, occurrence + 1);

            const places = placesOfTexts.get(item.text) ?? [];
            placesOfTexts.set(item.text, places);
            if (occurrence === places.length) {
                places.push(categories.length);
                categories.push(item.text);
            }

            return { item: item, index: places[occurrence] };
        });
    });

    return {
        categories: categories,
        series: series.map((current, index) => {
            const itemsByCategory = new Map(
                placedSeries[index].map((placed) => [placed.index, placed.item])
            );

            return {
                text: current.text,
                color: current.color,
                items: categories.map((_, category) =>
                    itemsByCategory.get(category)
                ),
            };
        }),
    };
}

/**
 * The item at a position, if there is one.
 * @param grid - the series
 * @param position - where the item is
 */
export function getItemAt(
    grid: SeriesGrid,
    position: ItemPosition
): ChartItem | undefined {
    return grid.series[position.series]?.items[position.index];
}

/**
 * The series that has an item at a place on the axis and is nearest to a
 * series: the series itself when it has an item there, otherwise the closest
 * one, and the earlier of two that are as close.
 * @param grid - the series
 * @param position - the place on the axis, and the series to start from
 */
export function getNearestSeries(
    grid: SeriesGrid,
    position: ItemPosition
): number | undefined {
    const distance = (series: number) => Math.abs(series - position.series);
    const [nearest] = [...grid.series.keys()]
        .filter((series) => getItemAt(grid, { ...position, series: series }))
        .sort((a, b) => distance(a) - distance(b));

    return nearest;
}

/**
 * The items of every series, in no particular order.
 * @param grid - the series
 */
export function getAllItems(grid: SeriesGrid): ChartItem[] {
    return grid.series.flatMap((series) =>
        series.items.filter((item) => item !== undefined)
    );
}
