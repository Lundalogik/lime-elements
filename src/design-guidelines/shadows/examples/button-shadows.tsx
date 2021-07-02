import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-button-shadows',
    shadow: true,
    styleUrl: 'shadow-examples.scss',
})
export class ButtonShadowExample {
    public render() {
        return [
            <div class="shadow-example-grid">
                <div class="visualization">
                    <button class="button normal">
                        <div class="label">Normal</div>
                    </button>
                    <code>--button-shadow-normal</code>
                    <p>makes the element look clickable</p>
                </div>
                <div class="visualization">
                    <button class="button hovered">
                        <div class="label">Hover</div>
                    </button>
                    <code>--button-shadow-hover</code>
                    <p>
                        makes the element look raised a bit more, ready to be
                        pressed
                    </p>
                </div>
                <div class="visualization">
                    <button class="button pressed">
                        <div class="label">Pressed</div>
                    </button>
                    <code>--button-shadow-pressed</code>
                    <p>
                        makes the element look pressed down towards the surface
                        below
                    </p>
                </div>
                <div class="visualization">
                    <button class="button inset">
                        <div class="label">Inset</div>
                    </button>
                    <code>--button-shadow-inset</code>
                    <p>
                        makes the element look pressed down below its background
                        surface
                    </p>
                </div>
                <div class="visualization">
                    <button class="button inset-pressed">
                        <div class="label three">Pressed Inset</div>
                    </button>
                    <code>--button-shadow-inset-pressed</code>
                    <p>makes the inset element look even more pressed down</p>
                </div>
            </div>,
        ];
    }
}
