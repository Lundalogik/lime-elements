import {
    Component,
    Event,
    Element,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
import { dispatchResizeEvent } from '../../util/dispatch-resize-event';
import { Action } from './action';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../util/make-enter-clickable';
import { createRandomString } from '../../util/random-string';

/**
 * A collapsible section can be used to group related content together
 * and hide the group when not needed.
 * Using this component can help to:
 * - Save vertical space by hiding non-essential content
 * - Improve content organization and scannability of the user interface
 * - Reduce cognitive load by displaying only a set of relevant information at a time
 * - Or disclose complex information, progressively to the user
 *
 * @slot - Content to put inside the collapsible section
 * @slot header - Optional slot for custom header content
 *
 * @exampleComponent limel-example-collapsible-section-basic
 * @exampleComponent limel-example-collapsible-section-actions
 * @exampleComponent limel-example-collapsible-section-with-custom-header-component
 * @exampleComponent limel-example-collapsible-section-external-control
 * @exampleComponent limel-example-collapsible-section-with-slider
 * @exampleComponent limel-example-collapsible-section-invalid
 * @exampleComponent limel-example-collapsible-section-css-props
 */
@Component({
    tag: 'limel-collapsible-section',
    shadow: true,
    styleUrl: 'collapsible-section.scss',
})
export class CollapsibleSection {
    /**
     * `true` if the section is expanded, `false` if collapsed.
     */
    @Prop({ mutable: true, reflect: true })
    public isOpen: boolean = false;

    /**
     * Text to display in the header of the section
     */
    @Prop({ reflect: true })
    public header: string;

    /**
     * `true` if the section is invalid, `false` if valid.
     * This can be used to indicate that the content inside the section is invalid.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Actions to place to the far right inside the header
     */
    @Prop()
    public actions: Action[];

    /**
     * Emitted when the section is expanded
     */
    @Event()
    private open: EventEmitter<void>;

    /**
     * Emitted when the section is collapsed
     */
    @Event()
    private close: EventEmitter<void>;

    /**
     * Emitted when an action is clicked inside the header
     */
    @Event()
    private action: EventEmitter<Action>;

    @Element()
    private host: HTMLElement;

    private bodyId = createRandomString();

    public componentDidRender() {
        const button = this.host.shadowRoot.querySelector(
            '.open-close-toggle',
        ) as HTMLElement;

        makeEnterClickable(button);
    }

    public disconnectedCallback() {
        const button = this.host.shadowRoot.querySelector(
            '.open-close-toggle',
        ) as HTMLElement;

        removeEnterClickable(button);
    }

    public render() {
        return (
            <section
                class={`${this.isOpen ? 'open' : ''}`}
                aria-invalid={this.invalid}
            >
                <header>
                    <button
                        class="open-close-toggle"
                        onClick={this.onClick}
                        aria-controls={this.bodyId}
                    />
                    <div class="expand-icon">
                        <div class="line" />
                        <div class="line" />
                        <div class="line" />
                        <div class="line" />
                    </div>
                    <h2 class="title mdc-typography mdc-typography--headline2">
                        {this.header}
                    </h2>
                    <div class="divider-line" />
                    {this.renderHeaderSlot()}
                    {this.renderActions()}
                </header>
                <div
                    class="body"
                    aria-hidden={String(!this.isOpen)}
                    id={this.bodyId}
                >
                    <slot />
                </div>
            </section>
        );
    }

    private onClick = () => {
        this.handleInteraction();
    };

    private handleInteraction = () => {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.open.emit();
            const waitForUiToRender = 100;
            setTimeout(dispatchResizeEvent, waitForUiToRender);
        } else {
            this.close.emit();
        }
    };

    private renderActions = () => {
        if (!this.actions) {
            return;
        }

        return (
            <div class="actions">
                {this.actions.map(this.renderActionButton)}
            </div>
        );
    };

    private renderHeaderSlot() {
        return <slot name="header" />;
    }

    private renderActionButton = (action: Action) => {
        return (
            <limel-icon-button
                icon={action.icon}
                label={action.label}
                disabled={action.disabled}
                onClick={this.handleActionClick(action)}
            />
        );
    };

    private handleActionClick = (action: Action) => (event: MouseEvent) => {
        event.stopPropagation();
        this.action.emit(action);
    };
}
