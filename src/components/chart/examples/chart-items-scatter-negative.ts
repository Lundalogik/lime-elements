import { ChartItem } from '@limetech/lime-elements';

/**
 * Each item's `value` is read as an `[x, y]` coordinate pair. Here `x` is the
 * year-over-year change in revenue and `y` the change in profit, both as a
 * percentage that can be negative. The points spread across all four quadrants,
 * so both axes cross zero — exercising the zero lines and negative ranges on
 * both the horizontal and the vertical axis. Cool dots gained profit, warm
 * dots lost it.
 */
export const chartItems: Array<ChartItem<[number, number]>> = [
    {
        text: 'Aurora',
        value: [32, 28],
        color: 'rgb(var(--color-sky-default))',
    },
    {
        text: 'Borealis',
        value: [18, 35],
        color: 'rgb(var(--color-blue-default))',
    },
    {
        text: 'Cascade',
        value: [-22, 19],
        color: 'rgb(var(--color-cyan-default))',
    },
    {
        text: 'Gale',
        value: [40, 12],
        color: 'rgb(var(--color-sky-light))',
    },
    {
        text: 'Ion',
        value: [6, 9],
        color: 'rgb(var(--color-sky-default))',
    },
    {
        text: 'Juniper',
        value: [-14, 24],
        color: 'rgb(var(--color-blue-default))',
    },
    {
        text: 'Nimbus',
        value: [-26, 30],
        color: 'rgb(var(--color-cyan-default))',
    },
    {
        text: 'Delta',
        value: [-30, -24],
        color: 'rgb(var(--color-red-default))',
    },
    {
        text: 'Equinox',
        value: [12, -16],
        color: 'rgb(var(--color-orange-default))',
    },
    {
        text: 'Fjord',
        value: [-8, -28],
        color: 'rgb(var(--color-red-default))',
    },
    {
        text: 'Harbor',
        value: [-35, -10],
        color: 'rgb(var(--color-orange-light))',
    },
    {
        text: 'Kelp',
        value: [25, -6],
        color: 'rgb(var(--color-orange-default))',
    },
    {
        text: 'Lumen',
        value: [-5, -5],
        color: 'rgb(var(--color-yellow-dark))',
    },
    {
        text: 'Mistral',
        value: [33, -20],
        color: 'rgb(var(--color-red-default))',
    },
    {
        text: 'Onyx',
        value: [9, -32],
        color: 'rgb(var(--color-orange-default))',
    },
    {
        text: 'Pike',
        value: [-18, -14],
        color: 'rgb(var(--color-orange-light))',
    },
];
