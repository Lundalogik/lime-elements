import { Component, Element, h, Prop, Watch } from '@stencil/core';
import {
    LoadingButtonInteraction,
    LoadingResult,
} from '../loading-button/loading-button.types';

/**
 * @exampleComponent limel-example-button-basic
 * @exampleComponent limel-example-button-disabled
 * @exampleComponent limel-example-button-icon
 * @exampleComponent limel-example-button-outlined
 * @exampleComponent limel-example-button-primary
 * @exampleComponent limel-example-button-composite
 * @exampleComponent limel-example-button-reduce-presence
 * @exampleComponent limel-example-button-colors
 */
@Component({
    tag: 'limel-button',
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
     * Please note that this does _not_ disable the button.
     * If the button should be disabled while loading, the
     * `disabled` property should be set to `true` as well.
     *
     * @deprecated Use limel-loading-button instead.
     */
    @Prop({ reflect: true })
    public loading = false;

    @Element()
    private host: HTMLLimelButtonElement;

    public componentDidLoad() {
        this.loadingWatcher(this.loading, this.loading);
    }

    public connectedCallback() {
        this.loadingWatcher(this.loading, this.loading);
    }

    public render() {
        return (
            <limel-loading-button
                label={this.label}
                primary={this.primary}
                outlined={this.outlined}
                icon={this.icon}
                disabled={this.disabled}
                hasReducedPresence={this.hasReducedPresence()}
                onInteract={this.handleInteractEvent}
            />
        );
    }

    @Watch('loading')
    protected loadingWatcher(newValue: boolean, oldValue: boolean) {
        const button = this.host?.querySelector('limel-loading-button');
        if (button && oldValue && !newValue) {
            button.resolveLoading(LoadingResult.SUCCESS);
        } else if (button && newValue) {
            // eslint-disable-next-line no-console
            console.warn(
                'The use of `loading` is deprecated. Please use limel-loading-button instead.'
            );
            button.indicateLoading();
        }
    }

    private handleInteractEvent = (
        event: CustomEvent<LoadingButtonInteraction>
    ) => {
        // Note that there is a `click` event too, and we let that through. /Ads
        event.stopPropagation();
    };

    private hasReducedPresence = () => {
        return this.host.classList.contains('has-reduced-presence');
    };
}
