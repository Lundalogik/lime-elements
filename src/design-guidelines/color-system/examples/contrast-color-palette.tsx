import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-contrast-color-palette',
    shadow: true,
    styleUrl: 'contrast-color-palette.scss',
})
export class PaletteExample {
    public render() {
        return (
            <div class="color-palette">
                <div class="swatch --contrast-100">
                    <span>100</span>
                </div>
                <div class="swatch --contrast-200">
                    <span>200</span>
                </div>
                <div class="swatch --contrast-300">
                    <span>300</span>
                </div>
                <div class="swatch --contrast-400">
                    <span>400</span>
                </div>
                <div class="swatch --contrast-500">
                    <span>500</span>
                </div>
                <div class="swatch --contrast-600">
                    <span>600</span>
                </div>
                <div class="swatch --contrast-700">
                    <span>700</span>
                </div>
                <div class="swatch --contrast-800">
                    <span>800</span>
                </div>
                <div class="swatch --contrast-900">
                    <span>900</span>
                </div>
                <div class="swatch --contrast-1000">
                    <span>1000</span>
                </div>
                <div class="swatch --contrast-1100">
                    <span>1100</span>
                </div>
                <div class="swatch --contrast-1200">
                    <span>1200</span>
                </div>
                <div class="swatch --contrast-1300">
                    <span>1300</span>
                </div>
                <div class="swatch --contrast-1400">
                    <span>1400</span>
                </div>
                <div class="swatch --contrast-1500">
                    <span>1500</span>
                </div>
                <div class="swatch --contrast-1600">
                    <span>1600</span>
                </div>
                <div class="swatch --contrast-1700">
                    <span>1700</span>
                </div>
                <div class="spacer"></div>
                <div class="swatch --color-white">
                    <span>white</span>
                </div>
                <div class="swatch --color-black">
                    <span>black</span>
                </div>
            </div>
        );
    }
}
