import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-chart-custom-colors',
    shadow: true,
})
export class ChartColorsExample {
    private labels = ['A', 'B'];
    private datasets = [
        {
            label: 'Using hex-values',
            data: [5, 3], // tslint:disable-line:no-magic-numbers
            backgroundColor: '#ff0000',
            borderColor: '#ff0000',
        },
        {
            label: 'Semi-transparent background, solid border',
            data: [5, 3], // tslint:disable-line:no-magic-numbers
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            borderColor: 'rgba(0, 0, 255, 1)',
        },
        {
            label: 'No color set ',
            data: [5, 3], // tslint:disable-line:no-magic-numbers
        },
        {
            label: 'No color set',
            data: [5, 3], // tslint:disable-line:no-magic-numbers
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
