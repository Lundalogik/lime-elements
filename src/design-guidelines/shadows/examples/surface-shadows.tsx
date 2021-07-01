import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-surface-shadows',
    shadow: true,
    styleUrl: 'shadow-examples.scss',
})
export class SurfaceShadowExample {
    public render() {
        return [
            <div class="shadow-example-grid">
                <div class="visualization">
                    <div class="surface shadow-depth-8">
                        <div class="label">Depth 8</div>
                    </div>
                    <code>--shadow-depth-8</code>
                    <p>
                        suitable for command bars, command dropdowns, context
                        menus
                    </p>
                </div>
                <div class="visualization">
                    <div class="surface shadow-depth-16">
                        <div class="label two">Depth 16</div>
                    </div>
                    <code>--shadow-depth-16</code>
                    <p>
                        suitable for callouts, search result dropdowns, cards,
                        or tooltips
                    </p>
                </div>
                <div class="visualization">
                    <div class="surface shadow-depth-16">
                        <div class="label two">Depth 64</div>
                    </div>
                    <code>--shadow-depth-64</code>
                    <p>suitable for modals, dialogs, or pop overs.</p>
                </div>
                <div class="visualization">
                    <div class="surface shadow-depth-8-reversed">
                        <div class="label two">Depth 8 · Reversed</div>
                    </div>
                    <code>--shadow-depth-8-reversed</code>
                    <p>
                        Same as `--shadow-depth-8`, but the light source is
                        below the element. Good to use on bars when they are
                        placed at the bottom edge of the screen.
                    </p>
                </div>
            </div>,
        ];
    }
}
