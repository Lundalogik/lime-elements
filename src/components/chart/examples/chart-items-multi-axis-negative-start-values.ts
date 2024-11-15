import { ChartItem } from '@limetech/lime-elements';

export const chartItems: Array<ChartItem<[number, number]>> = [
    {
        text: 'New York',
        value: [0, 10],
        color: 'rgb(var(--color-yellow-dark))',
        formattedValue: '0° — 10°',
    },
    {
        text: 'Kiruna',
        value: [-17, -5],
        color: 'rgb(var(--color-sky-lighter))',
        formattedValue: '-17° — -5°',
    },
    {
        text: 'Dubai',
        value: [20, 35],
        color: 'rgb(var(--color-red-default))',
        formattedValue: '20° — 35°',
    },
    {
        text: 'Sydney',
        value: [10, 25],
        color: 'rgb(var(--color-orange-default))',
        formattedValue: '10° — 25°',
    },
    {
        text: 'Reykjavik',
        value: [-10, 0],
        color: 'rgb(var(--color-sky-default))',
        formattedValue: '-10° — 0°',
    },
    {
        text: 'Helsinki',
        value: [-12, -2],
        color: 'rgb(var(--color-sky-light))',
        formattedValue: '-12° — -2°',
    },
    {
        text: 'Buenos Aires',
        value: [5, 22],
        color: 'rgb(var(--color-orange-light))',
        formattedValue: '5° — 22°',
    },
    {
        text: 'Tokyo',
        value: [6, 17],
        color: 'rgb(var(--color-orange-lighter))',
        formattedValue: '6° — 17°',
    },
];
