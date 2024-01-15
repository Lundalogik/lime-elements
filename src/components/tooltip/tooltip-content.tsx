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
     * Read more in tooltip.tsx
     */
    @Prop({ reflect: true })
    label!: string;

    /**
     * Read more in tooltip.tsx
     */
    @Prop({ reflect: true })
    helperLabel?: string;

    /**
     * Read more in tooltip.tsx
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
