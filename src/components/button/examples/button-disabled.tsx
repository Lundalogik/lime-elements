import { Component, h } from '@stencil/core';

/**
 * Disabled
 * :::note
 * Discover when to utilize the disabled state and when it is preferable to hide a button by reading our guidelines [Disabled vs. Hidden](#/DesignGuidelines/disabled-hidden.md/).
 * :::
 */
@Component({
    tag: 'limel-example-button-disabled',
    shadow: true,
    styleUrl: 'button-disabled.scss',
})
export class ButtonDisabledExample {
    public render() {
        return (
            <div class="disabled-buttons">
                <limel-button label="Default" disabled={true} />
                <limel-button label="Primary" primary={true} disabled={true} />
                <limel-button
                    label="Outlined"
                    outlined={true}
                    disabled={true}
                />
            </div>
        );
    }
}
