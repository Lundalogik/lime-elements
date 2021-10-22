import { Component, h, Prop, Element, State } from '@stencil/core';
import { createRandomString } from '../../util/random-string';

/**
 * Tooltips display a text label identifying an element, such as a description
 * of its function.
 *
 * In order to display the tooltip, the tooltip element and the owner element
 * that it should describe must be within the same document or document
 * fragment. A good practice is to just render them next to each other like so:
 *
 * ```html
 * <limel-button icon="search" id="tooltip-example" />
 * <limel-tooltip label="Search" elementId="tooltip-example" />
 * ```
 *
 * @exampleComponent limel-example-tooltip
 */
@Component({
    tag: 'limel-tooltip',
    shadow: true,
    styleUrl: 'tooltip.scss',
})
export class Tooltip {
    /**
     * Short descriptive text of the owner element.
     */
    @Prop({ reflect: true })
    public label!: string;

    /**
     * Additional helper text for the element.
     * Example usage can be a keyboard shortcut to activate the function of the
     * owner element.
     */
    @Prop({ reflect: true })
    public helperLabel: string;

    /**
     * ID of the owner element that the tooltip should describe.
     * Must be a child within the same document fragment as the tooltip element
     * itself.
     */
    @Prop({ reflect: true })
    public elementId!: string;

    @State()
    private open: boolean;

    @Element()
    private host: HTMLLimelTooltipElement;

    private portalId: string;
    private tooltipId: string;

    public constructor() {
        this.portalId = createRandomString();
        this.tooltipId = createRandomString();
    }

    public connectedCallback() {
        this.setOwnerAriaLabel();
        this.addListeners();
    }

    public disconnectedCallback() {
        this.removeListeners();
    }

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
                        role="tooltip"
                        aria-hidden={!this.open}
                        id={this.tooltipId}
                    />
                </limel-portal>
            </div>
        );
    }

    private setOwnerAriaLabel() {
        const owner = this.getOwnerElement();
        owner?.setAttribute('aria-describedby', this.tooltipId);
    }

    private addListeners() {
        const owner = this.getOwnerElement();
        owner?.addEventListener('mouseover', this.showTooltip);
        owner?.addEventListener('mouseout', this.hideTooltip);
        owner?.addEventListener('click', this.hideTooltip);
    }

    private removeListeners() {
        const owner = this.getOwnerElement();
        owner?.removeEventListener('mouseover', this.showTooltip);
        owner?.removeEventListener('mouseout', this.hideTooltip);
        owner?.removeEventListener('click', this.hideTooltip);
    }

    private showTooltip = () => {
        this.open = true;
    };

    private hideTooltip = () => {
        this.open = false;
    };

    private getOwnerElement(): HTMLElement | undefined {
        let element: Node = this.host;

        do {
            element = element.parentNode;
        } while (
            element &&
            element.nodeType !== Node.DOCUMENT_FRAGMENT_NODE &&
            element.nodeType !== Node.DOCUMENT_NODE
        );

        return (element as ShadowRoot)?.getElementById(this.elementId);
    }
}
