import { r as registerInstance, h } from './core-804afdbc.js';

const ChartLineExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.labels = ['January', 'February', 'March', 'April', 'May', 'June'];
        this.datasets = [
            {
                data: [65, 59, 80, 81, 56, 55],
                fill: false,
            },
        ];
        this.type = 'line';
        this.options = {
            legend: { display: false },
            elements: {
                line: {
                    tension: 0,
                },
            },
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

export { ChartLineExample as limel_example_chart_line };
