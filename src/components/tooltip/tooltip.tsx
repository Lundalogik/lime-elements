import { Component, h, Prop, Element, State } from '@stencil/core';
import { JSX } from 'react';
import { createRandomString } from '../../util/random-string';
import { OpenDirection } from '../../interface';

const DEFAULT_MAX_LENGTH = 50;

/**
 * A tooltip can be used to display a descriptive text for any element.
 * The displayed content must be a brief and supplemental string of text,
 * identifying the element or describing its function for the user,
 * helping them better understand unfamiliar objects that aren't described
 * directly in the UI.
 *
 * ## Interaction
 * The tooltip appears after a slight delay, when the element is hovered;
 * and disappears as soon as the cursor leaves the element.
 * Therefore, users cannot interact with the tip, but if the trigger element
 * itself is interactive, it will remain interactible even with a tooltip bound
 * to it.
 *
 * :::note
 * In order to display the tooltip, the tooltip element and its trigger element
 * must be within the same document or document fragment (the same shadowRoot).
 * Often, it's easiest to just place them next to each other like in the example
 * below, but if you need to, you can place them differently.
 *
 * ```html
 * <limel-button icon="search" id="tooltip-example" />
 * <limel-tooltip label="Search" elementId="tooltip-example" />
 * ```
 * :::
 *
 * ## Usage
 * - Keep in mind that tooltips can be distracting, and can be perceived as an interruption.
 * Use them only when they add significant value.
 * - A good tip is concise, helpful, and informative.
 * Don't explain the obvious or simply repeat what is already on the screen.
 * When used correctly, supplemental info of a tooltip helps to [declutter the UI](/#/DesignGuidelines/decluttering.md/).
 * - If the tip is essential to the primary tasks that the user is performing,
 * such as warnings or important notes, include the information directly in the
 * interface instead.
 * - When a component offers a helper text (e.g. [Input field](/#/component/limel-input-field/)),
 * use that, not a tooltip.
 * - Make sure to use the tooltip on an element that users naturally and
 * effortlessly recognize can be hovered.
 * @exampleComponent limel-example-tooltip-basic
 * @exampleComponent limel-example-tooltip-max-character
 * @exampleComponent limel-example-tooltip-composite
 */
@Component({
    tag: 'limel-tooltip',
    shadow: true,
    styleUrl: 'tooltip.scss',
})
export class Tooltip {
    /**
     * ID of the owner element that the tooltip should describe.
     * Must be a child within the same document fragment as the tooltip element
     * itself.
     */
    @Prop({ reflect: true })
    public elementId!: string;

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
    public helperLabel?: string;

    /**
     * The maximum amount of characters before rendering 'label' and
     * 'helperLabel' in two rows.
     */
    @Prop({ reflect: true })
    public maxlength?: number = DEFAULT_MAX_LENGTH;

    /**
     * Decides the tooltip's location in relation to its trigger.
     */
    @Prop({ reflect: true })
    public openDirection: OpenDirection = 'top';

    @Element()
    private host: HTMLLimelTooltipElement;

    @State()
    private open: boolean;

    private portalId: string;
    private tooltipId: string;
    private showTooltipTimeoutHandle: number;
    private ownerElement: HTMLElement;

    public constructor() {
        this.portalId = createRandomString();
        this.tooltipId = createRandomString();
    }

    public connectedCallback() {
        this.ownerElement = this.getOwnerElement();
        this.setOwnerAriaLabel();
        this.addListeners();
    }

    public disconnectedCallback() {
        this.removeListeners();
    }

    public render(): JSX.Element {
        const tooltipZIndex = getComputedStyle(this.host).getPropertyValue(
            '--tooltip-z-index'
        );

        return (
            <div class="trigger-anchor">
                <limel-portal
                    openDirection={this.openDirection}
                    visible={this.open}
                    containerId={this.portalId}
                    containerStyle={{
                        'z-index': tooltipZIndex,
                        'pointer-events': 'none',
                    }}
                    anchor={this.ownerElement}
                >
                    <limel-tooltip-content
                        label={this.label}
                        helperLabel={this.helperLabel}
                        maxlength={this.maxlength}
                        role="tooltip"
                        aria-hidden={!this.open}
                        id={this.tooltipId}
                    />
                </limel-portal>
            </div>
        );
    }

    private setOwnerAriaLabel() {
        this.ownerElement?.setAttribute('aria-describedby', this.tooltipId);
    }

    private addListeners() {
        this.ownerElement?.addEventListener('mouseover', this.showTooltip);
        this.ownerElement?.addEventListener('mouseout', this.hideTooltip);
        this.ownerElement?.addEventListener('click', this.hideTooltip);
    }

    private removeListeners() {
        this.ownerElement?.removeEventListener('mouseover', this.showTooltip);
        this.ownerElement?.removeEventListener('mouseout', this.hideTooltip);
        this.ownerElement?.removeEventListener('click', this.hideTooltip);
    }

    private showTooltip = () => {
        const tooltipDelay = 500;
        this.showTooltipTimeoutHandle = window.setTimeout(() => {
            this.open = true;
        }, tooltipDelay);
    };

    private hideTooltip = () => {
        clearTimeout(this.showTooltipTimeoutHandle);
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
