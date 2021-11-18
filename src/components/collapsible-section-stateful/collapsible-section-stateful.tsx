import { Component, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { Action } from '../collapsible-section/action';
import { getState, setState } from '../../util/state-service';

/**
 * @slot - Content to put inside the collapsible section
 * @exampleComponent limel-example-collapsible-section-stateful
 */
@Component({
    tag: 'limel-collapsible-section-stateful',
    shadow: true,
})
export class CollapsibleSectionStateful {
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
     * Used to identify the section for the purpose of remembering the
     * open/closed state.
     */
    @Prop({ reflect: true })
    public stateKey: string;

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
    protected action: EventEmitter<Action>;

    private stateId: string;

    public connectedCallback() {
        if (this.stateKey) {
            this.stateId = `limel-collapsible-section-stateful.${this.stateKey}.isOpen`;

            const isOpen = getState(this.stateId);

            if (
                (isOpen === true || isOpen === false) &&
                this.isOpen !== isOpen
            ) {
                this.isOpen = isOpen;
                this.emitOpenState();
            }
        }
    }

    public render() {
        return (
            <limel-collapsible-section
                isOpen={this.isOpen}
                header={this.header}
                actions={this.actions}
                onOpen={this.handleOpenEvent}
                onClose={this.handleCloseEvent}
            >
                <slot />
            </limel-collapsible-section>
        );
    }

    @Watch('isOpen')
    protected openCloseHandler(value: boolean) {
        if (this.stateId) {
            setState(this.stateId, value);
        }
    }

    private emitOpenState = () => {
        if (this.isOpen) {
            this.open.emit();
        } else {
            this.close.emit();
        }
    };

    private handleOpenEvent = () => {
        if (!this.isOpen) {
            this.isOpen = true;
        }
    };

    private handleCloseEvent = () => {
        if (this.isOpen) {
            this.isOpen = false;
        }
    };
}
