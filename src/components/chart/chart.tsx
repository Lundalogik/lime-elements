import { Component, Element, h, Prop } from '@stencil/core';
import Chart from 'chart.js';

@Component({
    tag: 'limel-chart',
    shadow: true,
})
export class LChart {
    /**
     * See the Chart.js documentation for [Category Cartesian Axis](https://www.chartjs.org/docs/2.7.3/axes/cartesian/category.html#category-cartesian-axis).
     */
    @Prop()
    public labels: Array<string | string[]> = [];

    /**
     * See the Chart.js documentation for your chosen [chart type](https://www.chartjs.org/docs/2.7.3/charts/).
     */
    @Prop()
    public datasets: any[] = [];

    @Prop({ reflectToAttr: true })
    public type: string;

    /**
     * See the Chart.js documentation for [Global Configuration](https://www.chartjs.org/docs/2.7.3/configuration/) and for your chosen [chart type](https://www.chartjs.org/docs/2.7.3/charts/).
     */
    @Prop()
    public options: any = {};

    @Element()
    private element: HTMLElement;

    private chart;

    private defaultColors = [
        '--lime-turquoise',
        '--lime-magenta',
        '--lime-yellow',
        '--lime-green',
        '--lime-red',
        '--lime-orange',
    ];

    public componentDidLoad() {
        const defaultFontColor = this.getPropertyValue('color');
        const defaultFontFamily = this.getPropertyValue('font-family');
        const defaultFontSize = parseInt(
            this.getPropertyValue('font-size').replace('px', ''),
            10
        );
        Chart.defaults.global.defaultFontColor = defaultFontColor;
        Chart.defaults.global.defaultFontFamily = defaultFontFamily;
        Chart.defaults.global.defaultFontSize = defaultFontSize;

        const datasets = this.getDatasetsWithColors(this.type);

        const canvas: HTMLCanvasElement = this.element.shadowRoot.querySelector(
            '.chart'
        );
        this.chart = new Chart(canvas, {
            data: { datasets: datasets, labels: this.labels },
            type: this.type,
            options: this.options,
        });
    }

    public componentDidUnload() {
        this.chart.destroy();
    }

    public render() {
        return (
            <div>
                <canvas class="chart" />
            </div>
        );
    }

    private getPropertyValue(propertyName) {
        return window
            .getComputedStyle(document.body)
            .getPropertyValue(propertyName)
            .trim();
    }

    private getDatasetsWithColors(chartType: string) {
        return this.datasets.map((dataset, index) => {
            if (dataset.backgroundColor || dataset.borderColor) {
                return { ...dataset };
            } else {
                return this.extendDatasetWithLimeColors(
                    index,
                    dataset,
                    chartType
                );
            }
        });
    }

    private extendDatasetWithLimeColors(index, dataset, chartType) {
        const colorIndex = index % this.defaultColors.length;
        const hexColor = this.getPropertyValue(this.defaultColors[colorIndex]);
        const rgbColor = this.convertHex(hexColor);
        const bgOpacity = chartType === 'bar' ? 1 : 0.2; // tslint:disable-line:no-magic-numbers

        return {
            ...dataset,
            backgroundColor: rgbColor.replace(')', ',' + bgOpacity + ')'),
            borderColor: rgbColor,
        };
    }

    private convertHex(hex) {
        const rEnd = 2;
        const gEnd = 4;
        const bEnd = 6;
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, rEnd), 16);
        const g = parseInt(hex.substring(rEnd, gEnd), 16);
        const b = parseInt(hex.substring(gEnd, bEnd), 16);

        return 'rgba(' + r + ',' + g + ',' + b + ')';
    }
}
