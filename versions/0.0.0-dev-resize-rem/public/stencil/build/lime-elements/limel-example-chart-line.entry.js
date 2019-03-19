const h = window.LimeElements.h;

class ChartLineExample {
    constructor() {
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
    static get is() { return "limel-example-chart-line"; }
    static get encapsulation() { return "shadow"; }
}

export { ChartLineExample as LimelExampleChartLine };
