import { Component, h, Prop, State, Watch, Element, Host } from '@stencil/core';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../util/make-enter-clickable';
import { Icon } from '../../global/shared-types/icon.types';
import { getIconName, getIconTitle } from '../icon/get-icon-props';

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
    shadow: { delegatesFocus: true },
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
    public icon: string | Icon;

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
            <Host onClick={this.filterClickWhenDisabled}>
                <button
                    class={{
                        loading: this.loading,
                        'just-loaded': this.justLoaded && !this.loadingFailed,
                        'just-failed': this.justLoaded && this.loadingFailed,
                        outlined: this.outlined,
                    }}
                    disabled={this.disabled || this.loading}
                    aria-busy={this.loading ? 'true' : 'false'}
                    aria-live="polite"
                >
                    {this.renderIcon(this.icon)}
                    {this.renderLabel()}
                    {this.renderSpinner()}
                    <svg viewBox="0 0 30 30">{this.renderLoadingIcons()}</svg>
                </button>
            </Host>
        );
    }

    @Watch('loading')
    protected loadingWatcher(newValue: boolean, oldValue: boolean) {
        const hasFinishedLoading = this.hasFinishedLoading(newValue, oldValue);
        if (hasFinishedLoading) {
            this.handleLoadingFinished();
        } else if (newValue) {
            this.handleLoadingStarted();
        }
    }

    private hasFinishedLoading(newValue: boolean, oldValue: boolean) {
        return oldValue && !newValue;
    }

    private handleLoadingFinished() {
        this.justLoaded = true;
        const TIMEOUT = 2000;
        this.justLoadedTimeout = window.setTimeout(() => {
            this.justLoaded = false;
        }, TIMEOUT);
    }

    private handleLoadingStarted() {
        this.justLoaded = false;
        window.clearTimeout(this.justLoadedTimeout);
    }

    private renderLoadingIcons() {
        if (this.loadingFailed) {
            return [
                <line x1="9" y1="9" x2="21" y2="21" />,
                <line x1="21" y1="9" x2="9" y2="21" />,
            ];
        }

        return [
            <line x1="8" y1="14" x2="15" y2="20" />,
            <line x1="23" y1="9" x2="14" y2="20" />,
        ];
    }

    private renderIcon(icon?: string | Icon) {
        const iconName = getIconName(icon);
        if (!iconName) {
            return;
        }

        const title = getIconTitle(icon);

        if (!this.label && !title) {
            const WARNING_MESSAGE =
                '⚠️ Accessibility warning: `limel-button` has no `label` and its `icon` has no `title`. ' +
                'This creates an inaccessible button for screen reader users. ' +
                'Please add either a `label`, a `title` to the `icon`, or use a `limel-tooltip`. ' +
                'See https://lundalogik.github.io/lime-elements/versions/latest/#/component/limel-button/ ' +
                'for more information.';
            // eslint-disable-next-line no-console
            console.warn(WARNING_MESSAGE);
        }

        let iconColor: string | undefined;

        if (typeof icon === 'object') {
            iconColor = icon.color;
        }

        const iconProps = {
            role: 'presentation',
            name: iconName,
            'aria-label': title,
            'aria-hidden': title ? null : 'true', // Use null instead of 'false' to remove attribute
            style: {
                color: iconColor,
            },
        };

        return <limel-icon {...iconProps} />;
    }

    private renderLabel() {
        if (!this.label) {
            return;
        }

        return <span class="label">{this.label}</span>;
    }

    private renderSpinner() {
        if (!this.loading) {
            return;
        }

        return <limel-spinner limeBranded={false} />;
    }

    private filterClickWhenDisabled = (e) => {
        if (this.disabled) {
            e.preventDefault();
        }
    };
}
