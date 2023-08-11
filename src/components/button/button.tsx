import { Component, h, Prop, State, Watch, Element } from '@stencil/core';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../util/make-enter-clickable';

/**
 * @exampleComponent limel-example-button-basic
 * @exampleComponent limel-example-button-primary
 * @exampleComponent limel-example-button-outlined
 * @exampleComponent limel-example-button-disabled
 * @exampleComponent limel-example-button-icon
 * @exampleComponent limel-example-button-loading
 * @exampleComponent limel-example-button-click-success
 * @exampleComponent limel-example-button-click-fail
 * @exampleComponent limel-example-button-reduce-presence
 * @exampleComponent limel-example-button-colors
 * @exampleComponent limel-example-button-composite
 */
@Component({
    tag: 'limel-button',
    shadow: true,
    styleUrl: 'button.scss',
})
export class Button {
    /**
     * The text to show on the button.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Set to `true` to make the button primary.
     */
    @Prop({ reflect: true })
    public primary = false;

    /**
     * Set to `true` to make the button outlined.
     */
    @Prop({ reflect: true })
    public outlined = false;

    /**
     * Set icon for the button
     */
    @Prop({ reflect: true })
    public icon: string;

    /**
     * Set to `true` to disable the button.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Set to `true` to put the button in the `loading` state.
     * This also disables the button.
     */
    @Prop({ reflect: true })
    public loading = false;

    /**
     * Set to `true` to indicate failure instead of success when the button is
     * no longer in the `loading` state.
     */
    @Prop({ reflect: true })
    public loadingFailed = false;

    @State()
    private justLoaded = false;

    @Element()
    private host: HTMLElement;

    private justLoadedTimeout?: number;

    public componentWillLoad() {
        makeEnterClickable(this.host);
    }

    public disconnectedCallback() {
        removeEnterClickable(this.host);
    }

    public render() {
        return (
            <button
                class={{
                    'mdc-button': true,
                    loading: this.loading,
                    'just-loaded': this.justLoaded && !this.loadingFailed,
                    'just-failed': this.justLoaded && this.loadingFailed,
                    'mdc-button--outlined': this.outlined,
                }}
                disabled={this.disabled || this.loading}
            >
                {this.renderIcon()}
                <span class="label mdc-button__label">{this.label}</span>
                <limel-spinner limeBranded={false} />
                <svg viewBox="0 0 30 30">{this.renderLoadingIcons()}</svg>
            </button>
        );
    }

    @Watch('loading')
    protected loadingWatcher(newValue: boolean, oldValue: boolean) {
        if (oldValue && !newValue) {
            this.justLoaded = true;
            const TIMEOUT = 2000;
            this.justLoadedTimeout = window.setTimeout(() => {
                this.justLoaded = false;
            }, TIMEOUT);
        } else if (newValue) {
            this.justLoaded = false;
            window.clearTimeout(this.justLoadedTimeout);
        }
    }

    private renderLoadingIcons() {
        if (this.loadingFailed) {
            return [
                <line x1="9" y1="9" x2="21" y2="21"></line>,
                <line x1="21" y1="9" x2="9" y2="21"></line>,
            ];
        }

        return [
            <line x1="8" y1="14" x2="15" y2="20"></line>,
            <line x1="23" y1="9" x2="14" y2="20"></line>,
        ];
    }

    private renderIcon(): HTMLElement {
        if (!this.icon) {
            return;
        }

        let withoutLabelClass = '';
        if (!this.label) {
            withoutLabelClass = 'no-label';
        }

        return (
            <i class={`mdc-button__icon ${withoutLabelClass}`}>
                <limel-icon name={this.icon} />
            </i>
        );
    }
}
