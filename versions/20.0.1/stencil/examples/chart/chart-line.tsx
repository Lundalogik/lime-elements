import { Component } from '@stencil/core';

@Component({
    tag: 'limel-example-chart-line',
    shadow: true,
})
export class ChartLineExample {
    private labels = ['January', 'February', 'March', 'April', 'May', 'June'];
    private datasets = [
        {
            data: [65, 59, 80, 81, 56, 55], // tslint:disable-line:no-magic-numbers
            fill: false,
        },
    ];

    private type: Chart.ChartType = 'line';
    private options = {
        legend: { display: false },
        elements: {
            line: {
                tension: 0, // draw straight lines
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

    public render() {
        return (
            <limel-chart
                type={this.type}
                labels={this.labels}
                datasets={this.datasets}
                options={this.options}
            />
        );
    }
}
