import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-size',
    shadow: true,
    styleUrl: 'size.scss',
})
export class SizeExample {
    @State()
    private visualizeSizes: boolean = false;

    constructor() {
        this.toggleMode = this.toggleMode.bind(this);
    }
    public render() {
        return [
            <div
                id="size-rhythm-example"
                class={{ 'visualize-sizes': this.visualizeSizes }}
            >
                <button class="button one">
                    <div class="label one">Button 1</div>
                </button>
                <button class="button two">
                    <div class="label two">Button 2</div>
                </button>
                <button class="button three">
                    <div class="label three">Button 3</div>
                </button>
            </div>,
            <limel-flex-container justify="start">
                <limel-checkbox
                    label="Visualize sizes"
                    onChange={this.toggleMode}
                    checked={this.visualizeSizes}
                />
            </limel-flex-container>,
        ];
    }

    private toggleMode() {
        this.visualizeSizes = !this.visualizeSizes;
    }
}
