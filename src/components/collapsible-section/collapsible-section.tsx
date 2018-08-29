import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';

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
     * Emitted when the section is expanded, regardless of initiator.
     */
    @Event()
    private open: EventEmitter;

    /**
     * Emitted when the section is collapsed, regardless of initiator.
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

    @Watch('isOpen')
    protected isOpenWatcher(newValue, oldValue) {
        if (newValue !== oldValue) {
            // The watcher gets triggered with `null` and `undefined`
            // a bunch of times when closing, so we check newValue
            // with === to avoid emitting more events than we should.
            // /Ads
            if (newValue === true) {
                this.open.emit();
            } else if (newValue === false) {
                this.close.emit();
            }
        }
    }

    private onClick() {
        this.isOpen = !this.isOpen;
    }
}
