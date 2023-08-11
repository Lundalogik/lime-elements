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
} from 'src/util/make-enter-clickable';

/**
 * @slot - Content to put inside the collapsible section
 * @exampleComponent limel-example-collapsible-section
 * @exampleComponent limel-example-collapsible-section-actions
 * @exampleComponent limel-example-collapsible-section-css-props
 * @exampleComponent limel-example-collapsible-section-external-control
 * @exampleComponent limel-example-collapsible-section-with-slider
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

    public componentDidRender() {
        const button = this.host.shadowRoot.querySelector(
            '.open-close-toggle'
        ) as HTMLElement;

        makeEnterClickable(button);
    }

    public disconnectedCallback() {
        const button = this.host.shadowRoot.querySelector(
            '.open-close-toggle'
        ) as HTMLElement;

        removeEnterClickable(button);
    }

    public render() {
        return (
            <section class={`${this.isOpen ? 'open' : ''}`}>
                <header>
                    <button class="open-close-toggle" onClick={this.onClick} />
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
                    {this.renderActions()}
                </header>
                <div class="body">
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
