import { Component, Element, h, Host, Prop } from '@stencil/core';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../util/make-enter-clickable';
import { createRandomString } from '../../util/random-string';

/**
 * @exampleComponent limel-example-icon-button-basic
 * @exampleComponent limel-example-icon-button-disabled
 * @exampleComponent limel-example-icon-button-elevated
 * @exampleComponent limel-example-icon-button-toggle-state
 * @exampleComponent limel-example-icon-button-composite
 */
@Component({
    tag: 'limel-icon-button',
    shadow: { delegatesFocus: true },
    styleUrl: 'icon-button.scss',
})
export class IconButton {
    /**
     * The icon to display.
     */
    @Prop({ reflect: true })
    public icon: string;

    /**
     * Set to `true` to give the button our standard "elevated" look, lifting
     * it off the flat layout.
     */
    @Prop({ reflect: true })
    public elevated = false;

    /**
     * The text to show to screenreaders and other assistive tech.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Set to `true` to disable the button.
     */
    @Prop({ reflect: true })
    public disabled = false;

    @Element()
    private host: HTMLLimelIconButtonElement;

    public connectedCallback() {
        this.initialize();
    }

    public componentWillLoad() {
        makeEnterClickable(this.host);
    }

    public disconnectedCallback() {
        removeEnterClickable(this.host);
    }

    public componentDidLoad() {
        this.initialize();
    }

    private tooltipId = createRandomString();

    private initialize() {
        const element = this.host.shadowRoot.querySelector('.mdc-icon-button');
        if (!element) {
            return;
        }
    }

    public render() {
        const buttonAttributes: { tabindex?: string } = {};

        if (this.host.hasAttribute('tabindex')) {
            buttonAttributes.tabindex = this.host.getAttribute('tabindex');
        }

        return (
            <Host onClick={this.filterClickWhenDisabled}>
                <button
                    disabled={this.disabled}
                    id={this.tooltipId}
                    {...buttonAttributes}
                >
                    <limel-icon name={this.icon} badge={true} />
                    {this.renderTooltip(this.tooltipId)}
                </button>
            </Host>
        );
    }
    private renderTooltip(tooltipId) {
        if (this.label) {
            return <limel-tooltip elementId={tooltipId} label={this.label} />;
        }
    }

    private filterClickWhenDisabled = (e) => {
        if (this.disabled) {
            e.preventDefault();
        }
    };
}
