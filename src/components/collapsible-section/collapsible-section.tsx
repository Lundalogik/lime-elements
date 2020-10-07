import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { dispatchResizeEvent } from '../../util/dispatch-resize-event';
import { Action } from './action';

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
     * Defaults to `false`.
     */
    @Prop({ mutable: true, reflectToAttr: true })
    public isOpen: boolean = false;

    /**
     * Text to display in the header of the section
     */
    @Prop()
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

    constructor() {
        this.onClick = this.onClick.bind(this);
        this.renderActionButton = this.renderActionButton.bind(this);
    }

    public render() {
        return (
            <section class={`${this.isOpen ? 'open' : ''}`}>
                <header onClick={this.onClick}>
                    <span class="expander">
                        <svg viewBox="0 0 30 30" width="100%" height="100%">
                            {(() => {
                                if (this.isOpen) {
                                    return (
                                        <path d="M15.5 12.246l1.008 1.008L21 17.746l-1.008 1.008-4.492-4.491-4.492 4.492L10 17.746l4.492-4.492 1.008-1.008z" />
                                    );
                                }

                                return (
                                    <path d="M15.5 19l1.008-1.008L21 13.5l-1.008-1.008-4.492 4.491-4.492-4.492L10 13.5l4.492 4.492L15.5 19z" />
                                );
                            })()}
                        </svg>
                    </span>
                    <h2 class="mdc-typography mdc-typography--headline2">
                        {this.header}
                    </h2>
                    {this.renderActions()}
                </header>
                <div class="body">
                    <slot />
                </div>
            </section>
        );
    }

    private onClick() {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.open.emit();
            const waitForUiToRender = 100;
            setTimeout(dispatchResizeEvent, waitForUiToRender);
        } else {
            this.close.emit();
        }
    }

    private renderActions() {
        if (!this.actions) {
            return;
        }

        return (
            <div class="actions">
                {this.actions.map(this.renderActionButton)}
            </div>
        );
    }

    private renderActionButton(action: Action) {
        return (
            <limel-icon-button
                icon={action.icon}
                label={action.label}
                disabled={action.disabled}
                onClick={this.handleActionClick(action)}
            />
        );
    }

    private handleActionClick = (action: Action) => (event: MouseEvent) => {
        event.stopPropagation();
        this.action.emit(action);
    };
}
