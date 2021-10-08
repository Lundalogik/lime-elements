import { Component, h, Prop, Element } from '@stencil/core';

/**
 * @exampleComponent limel-example-tooltip
 */

@Component({
    tag: 'limel-tooltip',
    shadow: true,
    styleUrl: 'tooltip.scss',
})
export class Tooltip {
    /**
     *tip to the hovered element
     */
    @Prop()
    label: string;

    /**
     *helperLabel to the hovered element
     */
    @Prop()
    helperLabel: string;

    /**
     *show if the element is hovered
     */
    @Prop()
    open: boolean;

    @Element()
    private host: HTMLLimelTooltipElement;

    private portalId: string;

    public render() {
        const tooltipZIndex = getComputedStyle(this.host).getPropertyValue(
            '--tooltip-z-index'
        );

        return (
            <div class="trigger-anchor">
                <limel-portal
                    visible={this.open}
                    containerId={this.portalId}
                    containerStyle={{
                        'z-index': tooltipZIndex,
                    }}
                >
                    <limel-tooltip-content
                        label={this.label}
                        helperLabel={this.helperLabel}
                    />
                </limel-portal>
            </div>
        );
    }
}
