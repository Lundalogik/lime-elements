import { r as registerInstance, h } from './core-804afdbc.js';

const ChartColorsExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.labels = ['A', 'B'];
        this.datasets = [
            {
                label: 'Using hex-values',
                data: [5, 3],
                backgroundColor: '#ff0000',
                borderColor: '#ff0000',
            },
            {
                label: 'Semi-transparent background, solid border',
                data: [5, 3],
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                borderColor: 'rgba(0, 0, 255, 1)',
            },
            {
                label: 'No color set ',
                data: [5, 3],
            },
            {
                label: 'No color set',
                data: [5, 3],
            },
        ];
        this.type = 'bar';
        this.options = {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        };
    }
    render() {
        return (h("limel-chart", { type: this.type, labels: this.labels, datasets: this.datasets, options: this.options }));
    }
};

export { ChartColorsExample as limel_example_chart_custom_colors };
