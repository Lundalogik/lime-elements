import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-size-edge-case',
    shadow: true,
    styleUrl: 'size-edge-case.scss',
})
export class SizeEdgeCaseExample {
    @State()
    private visualizeSizes: boolean = true;

    constructor() {
        this.toggleMode = this.toggleMode.bind(this);
    }
    public render() {
        return [
            <div
                id="size-rhythm-edge-case-example"
                class={{ 'visualize-sizes': this.visualizeSizes }}
            >
                <div class="grid">
                    <div class="row row-1">
                        <div class="cell picture"></div>
                        <div class="cell name">Mäkelä Jehkinen</div>
                        <div class="cell role">Head of Guardians</div>
                    </div>
                    <div class="row row-2">
                        <div class="cell picture"></div>
                        <div class="cell name">Goliham Gigantlle</div>
                        <div class="cell role">Chief Cool Stuff Officer</div>
                    </div>
                </div>
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
