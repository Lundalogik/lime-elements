const h = window.LimeElements.h;

class ChartBarExample {
    constructor() {
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
    static get is() { return "limel-example-chart-bar"; }
    static get encapsulation() { return "shadow"; }
}

export { ChartBarExample as LimelExampleChartBar };
