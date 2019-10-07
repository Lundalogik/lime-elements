import { Component, Element, h, Prop, Watch } from '@stencil/core';

@Component({
    tag: 'limel-button',
    shadow: true,
    styleUrl: 'button.scss',
})
export class Button {
    /**
     * The text to show on the button.
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    /**
     * Set to `true` to make the button primary.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public primary = false;

    /**
     * Set to `true` to make the button outlined.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public outlined = false;

    /**
     * Set icon for the button
     */
    @Prop({ reflectToAttr: true })
    public icon: string;

    /**
     * Set to `true` to disable the button.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public disabled = false;

    /**
     * Set to `true` to put the button in the `loading` state.
     * Please note that this does _not_ disable the button.
     * If the button should be disabled while loading, the
     * `disabled` property should be set to `true` as well.
     *
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public loading = false;

    @Element()
    private limelButton: HTMLElement;

    private justLoadedTimeout: NodeJS.Timeout;

    public render() {
        return (
            <button
                class={`
                    mdc-button
                    ${this.primary ? 'mdc-button--unelevated' : ''}
                    ${this.loading ? 'loading' : ''}
                    ${this.outlined ? 'mdc-button--outlined' : ''}
                `}
                disabled={this.disabled}
            >
                {this.renderIcon()}
                <span class="label mdc-button__label">{this.label}</span>
                <limel-spinner />
                <svg viewBox="0 0 30 30">
                    <path d="M20.659 10l-6.885 6.884-3.89-3.89-1.342 1.341 5.053 5.052.182.176L22 11.341z" />
                </svg>
            </button>
        );
    }

    @Watch('loading')
    protected loadingWatcher(newValue: boolean, oldValue: boolean) {
        const JUST_LOADED = 'just-loaded';
        const button = this.limelButton.shadowRoot.querySelector('button');
        if (oldValue && !newValue) {
            button.classList.remove('loading');
            button.classList.add(JUST_LOADED);
            const TIMEOUT = 2000;
            this.justLoadedTimeout = setTimeout(() => {
                button.classList.remove(JUST_LOADED);
            }, TIMEOUT);
        } else if (newValue) {
            button.classList.remove(JUST_LOADED);
            clearTimeout(this.justLoadedTimeout);
        }
    }

    /**
     * Render the icon for the button
     *
     * @returns {HTMLElement} the icon
     */
    private renderIcon() {
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
