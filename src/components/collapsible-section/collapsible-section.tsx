import {
    Component,
    Event,
    EventEmitter,
    h,
    Prop,
    Element,
} from '@stencil/core';
import { dispatchResizeEvent } from '../../util/dispatch-resize-event';
import { Action } from './action';
import { ENTER, ENTER_KEY_CODE } from '../../util/keycodes';

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

    @Element()
    private host: HTMLLimelCollapsibleSectionElement;

    public render() {
        return (
            <section class={`${this.isOpen ? 'open' : ''}`}>
                <header
                    class="section__header"
                    onClick={this.onClick}
                    onKeyDown={this.handleKeyDown}
                    tabindex="0"
                >
                    <div class="section__header__expand-icon">
                        <div class="expand-icon__line"></div>
                        <div class="expand-icon__line"></div>
                        <div class="expand-icon__line"></div>
                        <div class="expand-icon__line"></div>
                    </div>
                    <h2 class="section__header__title mdc-typography mdc-typography--headline2">
                        {this.header}
                    </h2>
                    <div class="section__header__divider-line" />
                    {this.renderActions()}
                </header>
                <div class="section__body">
                    <slot />
                </div>
            </section>
        );
    }

    private onClick = () => {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.open.emit();
            const waitForUiToRender = 100;
            setTimeout(dispatchResizeEvent, waitForUiToRender);
        } else {
            this.close.emit();
        }
    };

    private handleKeyDown = (event: KeyboardEvent) => {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;

        if (isEnter) {
            event.stopPropagation();
            event.preventDefault();
            const element = (this.host.shadowRoot.activeElement ||
                document.activeElement) as HTMLElement;
            element.click();
        }
    };

    private renderActions = () => {
        if (!this.actions) {
            return;
        }

        return (
            <div class="section__header__actions">
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
