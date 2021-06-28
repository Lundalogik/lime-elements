import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-surface-shadows-inflated',
    shadow: true,
    styleUrl: 'shadow-examples.scss',
})
export class SurfaceShadowInflatedExample {
    public render() {
        return [
            <div class="shadow-example-grid inflated-examples">
                <div class="visualization">
                    <div class="surface shadow-inflated-8">
                        <div class="label">Inflated 8</div>
                    </div>
                    <code>--shadow--inflated-8</code>
                    <p></p>
                </div>
                <div class="visualization">
                    <div class="surface shadow-inflated-16">
                        <div class="label two">Inflated 16</div>
                    </div>
                    <code>--shadow--inflated-16</code>
                    <p></p>
                </div>
                <div class="visualization">
                    <div class="surface shadow-inflated-64">
                        <div class="label two">Inflated 64</div>
                    </div>
                    <code>--shadow--inflated-64</code>
                    <p></p>
                </div>
            </div>,
        ];
    }
}
