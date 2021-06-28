import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-ui-color-palette',
    shadow: true,
    styleUrl: 'ui-color-palette.scss',
})
export class PaletteExample {
    public render() {
        return (
            <div class="color-palette">
                <div class="swatch --color-red-light"></div>
                <div class="swatch --color-red-default">·</div>
                <div class="swatch hue">red</div>
                <div class="usage">
                    <ul>
                        <li>danger</li>
                        <li>irreversible change</li>
                        <li>delete</li>
                        <li>failed</li>
                        <li>serious error</li>
                        <li>stop</li>
                        <li>negative feedback</li>
                    </ul>
                </div>
                <div class="swatch --color-blue-light"></div>
                <div class="swatch --color-blue-default">·</div>
                <div class="swatch hue">blue</div>
                <div class="usage">
                    <ul>
                        <li>success</li>
                        <li>external links</li>
                        <li>information</li>
                        <li>help</li>
                        <li>accented (generic)</li>
                        <li>positive feedback</li>
                    </ul>
                </div>
                <div class="swatch --color-green-light"></div>
                <div class="swatch --color-green-default">·</div>
                <div class="swatch hue">green</div>
                <div class="usage">
                    <ul>
                        <li>ok</li>
                        <li>safe</li>
                        <li>turned on</li>
                        <li>ongoing</li>
                        <li>new</li>
                        <li>restore</li>
                        <li>continue</li>
                    </ul>
                </div>
                <div class="swatch --color-amber-light"></div>
                <div class="swatch --color-amber-default">·</div>
                <div class="swatch hue">amber</div>
                <div class="usage">
                    <ul>
                        <li>caution</li>
                        <li>attention</li>
                        <li>paused</li>
                    </ul>
                </div>
                <div class="swatch --color-orange-light"></div>
                <div class="swatch --color-orange-default">·</div>
                <div class="swatch hue">orange</div>
                <div class="usage">
                    <ul>
                        <li>warning</li>
                        <li>moderate error</li>
                    </ul>
                </div>
                <div class="brightness-label">light</div>
                <div class="brightness-label">default</div>
            </div>
        );
    }
}
