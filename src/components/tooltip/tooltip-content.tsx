import { Component, h, Prop } from '@stencil/core';

/**
 * This component is used internally by `limel-tooltip`.
 *
 * @private
 */
@Component({
    tag: 'limel-tooltip-content',
    shadow: true,
    styleUrl: 'tooltip-content.scss',
})
export class TooltipContent {
    /**
     * Short descriptive text of the owner element.
     */
    @Prop({ reflect: true })
    label: string;

    /**
     * Additional helper text for the element.
     * Example usage can be a keyboard shortcut to activate the function of the
     * owner element.
     */
    @Prop({ reflect: true })
    helperLabel: string;

    public render() {
        return [
            <div class="label">{this.label}</div>,
            <div class="helper-label">{this.helperLabel}</div>,
        ];
    }
}
