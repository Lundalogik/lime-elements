import { r as registerInstance, h } from './core-804afdbc.js';

const ChartBarExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.labels = ['Cheese', 'Coffee'];
        this.datasets = [
            {
                label: 'France',
                data: [12, 5],
            },
            {
                label: 'Sweden',
                data: [3, 19],
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

export { ChartBarExample as limel_example_chart_bar };
