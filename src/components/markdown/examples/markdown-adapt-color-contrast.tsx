import { Component, h, Host } from '@stencil/core';

const markdown = `
<p style="color: rgb(245, 245, 245)">Light grey — fails contrast.</p>
<p style="color: rgb(200, 38, 19)">Saturated red — passes contrast.</p>
<p style="color: rgb(31, 73, 125)">Dark navy — passes contrast.</p>
<p style="color: rgb(220, 220, 220)">Off-white — fails contrast.</p>
`;

const surface = {
    background: '#ffffff',
    color: '#222222',
    padding: '0.5rem 0.75rem',
};

/**
 * Adapting color contrast
 *
 * Setting `adaptColorContrast` to `true` removes inline `color`
 * declarations whose contrast against the resolved surface falls below
 * WCAG 3:1. Both renders below sit on a forced white surface; the
 * low-contrast lines disappear in the default render and become readable
 * when adaptation is on. Colors that already pass are kept untouched.
 */
@Component({
    tag: 'limel-example-markdown-adapt-color-contrast',
    shadow: true,
})
export class MarkdownAdaptColorContrastExample {
    public render() {
        return (
            <Host>
                <h4>Default</h4>
                <div style={surface}>
                    <limel-markdown value={markdown} />
                </div>
                <h4>Adapted</h4>
                <div style={surface}>
                    <limel-markdown
                        value={markdown}
                        adaptColorContrast={true}
                    />
                </div>
            </Host>
        );
    }
}
