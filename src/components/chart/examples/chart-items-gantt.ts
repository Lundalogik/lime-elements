import { ChartItem } from '@limetech/lime-elements';
export const chartItems: Array<ChartItem<[number, number]>> = [
    {
        text: 'Market Research',
        formattedValue: 'day 1 — day 10',
        value: [1, 10],
        color: 'rgb(var(--color-blue-default))',
    },
    {
        text: 'Business Plan Development',
        formattedValue: 'day 1 — day 20',
        value: [1, 20],
        color: 'rgb(var(--color-green-default))',
    },
    {
        text: 'Prototyping',
        formattedValue: 'day 10 — day 40',
        value: [10, 40],
        color: 'rgb(var(--color-cyan-default))',
    },
    {
        text: 'User Testing',
        formattedValue: 'day 15 — day 70',
        value: [15, 70],
        color: 'rgb(var(--color-purple-default))',
    },
    {
        text: 'MVP Development',
        formattedValue: 'day 70 — day 120',
        value: [70, 120],
        color: 'rgb(var(--color-pink-default))',
    },
    {
        text: 'Marketing & PR',
        formattedValue: 'day 80 — day 130',
        value: [80, 130],
        color: 'rgb(var(--color-violet-default))',
    },
    {
        text: 'Launch Preparation',
        formattedValue: 'day 110 — day 140',
        value: [110, 140],
        color: 'rgb(var(--color-orange-default))',
    },
    {
        text: 'Product Launch',
        formattedValue: 'day 140 — day 155',
        value: [140, 155],
        color: 'rgb(var(--color-teal-default))',
    },
];
