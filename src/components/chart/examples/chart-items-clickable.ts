import { ChartItem } from '@limetech/lime-elements';
export const chartItems: ChartItem[] = [
    {
        text: 'Applications',
        value: 40,
        formattedValue: '40 gb',
        color: 'rgb(var(--color-brown-dark))',
        clickable: true,
    },
    {
        text: 'Application cache',
        value: 18,
        formattedValue: '18 gb',
        color: 'rgb(var(--color-brown-default))',
        clickable: true,
    },
    {
        text: 'Temporary files',
        value: 23,
        formattedValue: '23 gb',
        color: 'rgb(var(--color-cyan-default))',
        clickable: true,
    },
    {
        text: 'OS data',
        value: 16,
        formattedValue: '16 gb',
        color: 'rgb(var(--color-yellow-default))',
        clickable: true,
    },
];
