import { Component, h, State } from '@stencil/core';
@Component({
    tag: 'limel-example-color-picker-basic',
    shadow: true,
})
export class ColorPickerExample {
    @State()
    private value: string;

    public render() {
        return (
            <limel-color-picker
                value={this.value}
                tooltipLabel="Click to pick a color"
                helperText="You can also type a color name or value to preview it here"
                label="Chosen color"
                onChange={this.onChange}
            />
        );
    }

    private onChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
