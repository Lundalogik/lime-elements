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
    label!: string;

    /**
     * Additional helper text for the element.
     * Example usage can be a keyboard shortcut to activate the function of the
     * owner element.
     */
    @Prop({ reflect: true })
    helperLabel?: string;

    /**
     * The maximum amount of characters before rendering 'label' and 'helperLabel' in two rows.
     */
    @Prop({ reflect: true })
    maxlength?: number;

    public render() {
        let isLabelsTextLong = false;
        if (this.helperLabel && this.maxlength) {
            isLabelsTextLong =
                this.label.length + this.helperLabel.length > this.maxlength;
        }

        const props: any = {};
        if (this.maxlength) {
            props.style = {
                '--tooltip-max-width-of-text': `${this.maxlength}` + 'ch',
            };
        }

        return [
            <text class={{ 'has-column-layout': isLabelsTextLong }} {...props}>
                <div class="label">{this.label}</div>
                <div class="helper-label">{this.helperLabel}</div>
            </text>,
        ];
    }
}
