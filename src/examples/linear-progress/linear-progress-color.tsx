import { Component, State } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-linear-progress-color',
})
export class LinearProgressExampleColor {
    @State()
    private color = { text: 'cornflowerblue', value: 'cornflowerblue' };

    private fixedValueForColorExample = 0.85;

    private colors = [
        { text: 'firebrick', value: 'firebrick' },
        { text: 'chocolate', value: 'chocolate' },
        { text: 'goldenrod', value: 'goldenrod' },
        { text: 'seagreen', value: 'seagreen' },
        { text: 'cornflowerblue', value: 'cornflowerblue' },
        { text: 'rebeccapurple', value: 'rebeccapurple' },
    ];

    public render() {
        return [
            <limel-select
                label="Color"
                options={this.colors}
                value={this.color}
                onChange={event => {
                    this.color = event.detail;
                }}
            />,
            <br />,
            <limel-linear-progress
                value={this.fixedValueForColorExample}
                style={{
                    '--mdc-theme-primary': this.color.value,
                }}
            />,
        ];
    }
}
