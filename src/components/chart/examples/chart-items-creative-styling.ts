import { ChartItem } from '@limetech/lime-elements';
export const stackedBarChartItems: ChartItem[] = [
    {
        text: 'Applications',
        value: 40,
        formattedValue: '40 gb',
        color: 'rgb(var(--color-coral-default))',
    },
    {
        text: 'Application cache',
        value: 18,
        formattedValue: '18 gb',
        color: "rgb(var(--color-coral-default)) url(\"data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 8 8'><defs><pattern id='diagonalHatch' patternUnits='userSpaceOnUse' width='7' height='4' patternTransform='rotate(-60)'><path d='M-1,2 l6,0' stroke='rgba(255,255,255,0.4)' stroke-width='1'/></pattern></defs><rect width='8' height='8' fill='url(%23diagonalHatch)'/></svg>\")",
    },
    {
        text: 'Temporary files',
        value: 23,
        formattedValue: '23 gb',
        color: 'rgb(var(--color-cyan-default))',
    },
    {
        text: 'OS data',
        value: 16,
        formattedValue: '16 gb',
        color: 'rgb(var(--color-blue-default))',
    },
];

export const ganttChartItems: Array<ChartItem<[number, number]>> = [
    {
        text: 'Week 1',
        formattedValue: '-7% — 10%',
        value: [-7, 10],
        color: 'rgb(var(--color-blue-default))',
    },
    {
        text: 'Week 2',
        formattedValue: '4% — 32%',
        value: [4, 32],
        color: "rgb(var(--color-orange-light)) url(\"data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'><circle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.3)' /><circle cx='6' cy='2' r='1' fill='rgba(255,255,255,0.3)' /><circle cx='2' cy='6' r='1' fill='rgba(255,255,255,0.3)' /><circle cx='6' cy='6' r='1' fill='rgba(255,255,255,0.3)' /></svg>\")",
    },
    {
        text: 'Week 3',
        formattedValue: '14% — 44%',
        value: [14, 44],
        color: "rgb(var(--color-cyan-default)) url(\"data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg'  width='8' height='8' viewBox='0 0 8 8' style='fill-rule:evenodd;'><path fill='rgba(0,0,0,0.1)' d='M0 0h4v4H0zM4 4h4v4H4z'/></svg>\")",
    },
];

export const areaChartItems: ChartItem[] = [
    {
        text: '10 to 20',
        value: 6,
        color: 'linear-gradient(0deg, rgb(var(--color-cyan-default)) 0%, rgb(var(--color-red-default)) 80%)',
    },
    {
        text: '20 to 30',
        value: 12,
        color: 'linear-gradient(0deg, rgb(var(--color-cyan-default)) 0%, rgb(var(--color-red-default)) 80%)',
    },
    {
        text: '30 to 40',
        value: 18,
        color: 'linear-gradient(0deg, rgb(var(--color-cyan-default)) 0%, rgb(var(--color-red-default)) 80%)',
    },
    {
        text: '40 to 50',
        value: 23,
        color: 'linear-gradient(0deg, rgb(var(--color-cyan-default)) 0%, rgb(var(--color-red-default)) 80%)',
    },
    {
        text: '50 to 60',
        value: 30,
        color: 'linear-gradient(0deg, rgb(var(--color-cyan-default)) 0%, rgb(var(--color-red-default)) 80%)',
    },
    {
        text: '60 to 70',
        value: 18,
        color: 'linear-gradient(0deg, rgb(var(--color-cyan-default)) 0%, rgb(var(--color-red-default)) 80%)',
    },
];
