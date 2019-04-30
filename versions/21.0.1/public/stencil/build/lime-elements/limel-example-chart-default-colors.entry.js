const h = window.LimeElements.h;

class ChartDefaultColorsExample {
    constructor() {
        this.labels = ['A', 'B'];
        this.datasets = [
            {
                label: 'Turquoise',
                data: [5, 3],
            },
            {
                label: 'Magenta',
                data: [5, 3],
            },
            {
                label: 'Yellow',
                data: [5, 3],
            },
            {
                label: 'Green',
                data: [5, 3],
            },
            {
                label: 'Red',
                data: [5, 3],
            },
            {
                label: 'Orange',
                data: [5, 3],
            },
            {
                label: 'Repeat',
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
    static get is() { return "limel-example-chart-default-colors"; }
    static get encapsulation() { return "shadow"; }
}

export { ChartDefaultColorsExample as LimelExampleChartDefaultColors };
