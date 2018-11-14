import { Component, Event, EventEmitter, Prop } from '@stencil/core';
import { dispatchResizeEvent } from '../../util/dispatch-resize-event';

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
     * Emitted when the section is expanded
     */
    @Event()
    private open: EventEmitter;

    /**
     * Emitted when the section is collapsed
     */
    @Event()
    private close: EventEmitter;

    public render() {
        return (
            <section class={`${this.isOpen ? 'open' : ''}`}>
                <header onClick={this.onClick.bind(this)}>
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
                    <slot name="header" />
                </header>
                <div class="body">
                    <slot name="body" />
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
}
