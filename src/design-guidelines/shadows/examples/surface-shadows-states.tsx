import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-surface-shadows-states',
    shadow: true,
    styleUrl: 'shadow-examples.scss',
})
export class SurfaceShadowStateExample {
    public render() {
        return [
            <div class="shadow-example-grid">
                <div class="visualization">
                    <div class="surface shadow-depth-8-focused">
                        <div class="label">Depth 8 · Focused</div>
                    </div>
                    <code>--shadow-depth-8-focused</code>
                    <p>
                        Can be used for elements that have `--shadow-depth-8`,
                        when visualizing element focus, e.g. due to keyboard
                        navigation.
                    </p>
                </div>
                <div class="visualization">
                    <div class="surface shadow-depth-16-focused">
                        <div class="label two">Depth 16 · Focused</div>
                    </div>
                    <code>--shadow-depth-16-focused</code>
                    <p>
                        Can be used for elements that have `--shadow-depth-16`,
                        when visualizing element focus, e.g. due to keyboard
                        navigation.
                    </p>
                </div>
                <div class="visualization">
                    <div class="surface shadow-depth-64-focused">
                        <div class="label two">Depth 64 · Focused</div>
                    </div>
                    <code>--shadow-depth-64-focused</code>
                    <p>
                        Can be used for elements that have `--shadow-depth-64`,
                        when visualizing element focus, e.g. due to keyboard
                        navigation.
                    </p>
                </div>
                <div class="visualization">
                    <div class="surface shadow-depth-8-error">
                        <div class="label">Depth 8 · Error</div>
                    </div>
                    <code>--shadow-depth-8-error</code>
                    <p>
                        Can be used for elements that have `--shadow-depth-8`,
                        when visualizing that the element requires attention,
                        e.g. due to errors.
                    </p>
                </div>
            </div>,
        ];
    }
}
