import { ChartItem } from '@limetech/lime-elements';

/**
 * Each item's `value` is read as an `[x, y]` coordinate pair for the
 * `scatter` type. Here `x` is the marketing spend (in thousands) and `y`
 * is the number of new customers. Several points sit close together, overlap,
 * or are placed exactly on top of each other, to demonstrate that the scatter
 * type does not space items out the way a dot chart does.
 */
export const chartItems: ChartItem[] = [
    {
        text: 'Week 1',
        value: [8, 12],
        color: 'var(--color-percent--10to20)',
    },
    {
        text: 'Week 2',
        value: [12, 9],
        color: 'var(--color-percent--0to10)',
    },
    {
        text: 'Week 3',
        value: [12, 11],
        color: 'var(--color-percent--10to20)',
    },
    {
        text: 'Week 4',
        value: [18, 22],
        color: 'var(--color-percent--20to30)',
    },
    {
        text: 'Week 5',
        value: [20, 21],
        color: 'var(--color-percent--20to30)',
    },
    {
        text: 'Week 6',
        value: [20, 21],
        color: 'var(--color-percent--20to30)',
    },
    {
        text: 'Week 7',
        value: [27, 35],
        color: 'var(--color-percent--30to40)',
    },
    {
        text: 'Week 8',
        value: [30, 33],
        color: 'var(--color-percent--30to40)',
    },
    {
        text: 'Week 9',
        value: [33, 44],
        color: 'var(--color-percent--40to50)',
    },
    {
        text: 'Week 10',
        value: [35, 41],
        color: 'var(--color-percent--40to50)',
    },
    {
        text: 'Week 11',
        value: [42, 48],
        color: 'var(--color-percent--40to50)',
    },
    {
        text: 'Week 12',
        value: [45, 52],
        color: 'var(--color-percent--50to60)',
    },
    {
        text: 'Week 13',
        value: [46, 51],
        color: 'var(--color-percent--50to60)',
    },
    {
        text: 'Week 14',
        value: [55, 49],
        color: 'var(--color-percent--40to50)',
    },
    {
        text: 'Week 15',
        value: [58, 66],
        color: 'var(--color-percent--60to70)',
    },
    {
        text: 'Week 16',
        value: [60, 64],
        color: 'var(--color-percent--60to70)',
    },
    {
        text: 'Week 17',
        value: [67, 72],
        color: 'var(--color-percent--70to80)',
    },
    {
        text: 'Week 18',
        value: [70, 68],
        color: 'var(--color-percent--60to70)',
    },
    {
        text: 'Week 19',
        value: [74, 81],
        color: 'var(--color-percent--80to90)',
    },
    {
        text: 'Week 20',
        value: [78, 77],
        color: 'var(--color-percent--70to80)',
    },
    {
        text: 'Week 21',
        value: [85, 88],
        color: 'var(--color-percent--80to90)',
    },
    {
        text: 'Week 22',
        value: [88, 92],
        color: 'var(--color-percent--90to100)',
    },
    {
        text: 'Week 23',
        value: [88, 92],
        color: 'var(--color-percent--90to100)',
    },
    {
        text: 'Week 24',
        value: [95, 90],
        color: 'var(--color-percent--90to100)',
    },
];
