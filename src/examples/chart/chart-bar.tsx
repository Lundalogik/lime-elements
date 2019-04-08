import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-chart-bar',
    shadow: true,
})
export class ChartBarExample {
    private labels = ['Cheese', 'Coffee'];
    private datasets = [
        {
            label: 'France',
            data: [12, 5], // tslint:disable-line:no-magic-numbers
        },
        {
            label: 'Sweden',
            data: [3, 19], // tslint:disable-line:no-magic-numbers
        },
    ];

    private type: Chart.ChartType = 'bar';
    private options = {
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
