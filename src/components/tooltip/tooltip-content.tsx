import { Component, h, Prop } from '@stencil/core';

/**
 * @private
 */

@Component({
    tag: 'limel-tooltip-content',
    shadow: true,
    styleUrl: 'tooltip-content.scss',
})
export class TooltipContent {
    /**
     *tip for the hovered element
     */
    @Prop()
    label: string;

    /**
     *hotkey for the hovered element
     */
    @Prop()
    helperLabel: string;

    public render() {
        return (
            <div class="tooltip-content">
                <div class="tooltip">{this.label}</div>
                <div class="helperLabel">{this.helperLabel}</div>
            </div>
        );
    }
}
