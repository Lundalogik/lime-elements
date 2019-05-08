---
name: Chart
route: /chart
menu: Components
---

# Chart

For detailed documentation of the configuration options, please see https://www.chartjs.org/docs/2.7.3/charts/

<limel-props name="limel-chart" />

## Examples

### Using Default Colors

When using `limel-chart` without colors specified, the chart will default to the Lime brand colors. If there are more datasets than colors, the colors will repeat.

<limel-example path="chart" name="limel-example-chart-default-colors" />

### Using Custom Colors

Colors can be set using any css color value. The most commonly used will likely be hex-values (e.g. `#ff0000` for red), rgb-values (e.g. `rbg(255, 0, 0)` for red) and rgba-values (e.g. `rgba(255, 0, 0, 0.5)` for red with 50 % transparency).

<limel-example path="chart" name="limel-example-chart-custom-colors" />

## Chart Types

### Bar Chart

<limel-example path="chart" name="limel-example-chart-bar" />

### Line Chart

<limel-example path="chart" name="limel-example-chart-line" />
