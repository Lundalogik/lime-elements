import { Component, h, State } from '@stencil/core';
/**
 * The popover arrow
 * By default, popovers have arrows which are pointing to where they originated
 * from. However you can turn off this visual decoration by setting `useArrow={false}`.
 */
@Component({
    tag: 'limel-example-popover-no-arrow',
    shadow: true,
    styleUrl: 'popover-no-arrow.scss',
})
export class PopoverExampleNoArrow {
    @State()
    private isOpen = false;

    constructor() {
        this.openPopover = this.openPopover.bind(this);
        this.onPopoverClose = this.onPopoverClose.bind(this);
    }

    public render() {
        return [
            <limel-popover
                open={this.isOpen}
                onClose={this.onPopoverClose}
                useArrow={false}
            >
                <limel-icon-button
                    slot="trigger"
                    icon="info"
                    label="Learn more…"
                    elevated={true}
                    onClick={this.openPopover}
                />
                <div style={{ padding: '0 1.5rem' }}>
                    <h4>No arrows!</h4>
                    <p>You see no arrows pointing to my origin.</p>
                </div>
            </limel-popover>,
        ];
    }

    private openPopover(event: MouseEvent) {
        event.stopPropagation();
        console.log('opening');
        this.isOpen = true;
    }

    private onPopoverClose(event: CustomEvent) {
        event.stopPropagation();
        console.log('closing');
        this.isOpen = false;
    }
}
