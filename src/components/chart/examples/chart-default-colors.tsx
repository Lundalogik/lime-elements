import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-chart-default-colors',
    shadow: true,
})
export class ChartDefaultColorsExample {
    private labels = ['A', 'B'];
    private datasets = [
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
