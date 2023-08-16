import { Component, h, Element, State } from '@stencil/core';

/**
 * Disconnect test
 *
 * This is an example to test that it works to remove a popover from the DOM,
 * then add it back again without breaking it
 */
@Component({
    tag: 'limel-example-portal-basic',
    shadow: true,
})
export class PortalBasicExample {
    @State()
    private isOpen = false;

    @Element()
    private host: HTMLLimelExamplePortalBasicElement;

    @State()
    private container: HTMLElement;

    public render() {
        return (
            <div class="root">
                <limel-button
                    label="Disconnect from DOM"
                    disabled={!!this.container}
                    onClick={this.handleDisconnect}
                />
                <limel-button
                    label="Connect to DOM"
                    disabled={!this.container}
                    onClick={this.handleConnect}
                />
                <div class="container">
                    <limel-popover
                        open={this.isOpen}
                        onClose={this.onPopoverClose}
                    >
                        <limel-button
                            slot="trigger"
                            primary={true}
                            label="Click me!"
                            onClick={this.openPopover}
                        />
                        <div>CONTENT</div>
                    </limel-popover>
                </div>
            </div>
        );
    }

    private handleDisconnect = () => {
        if (this.container) {
            return;
        }

        const root = this.host.shadowRoot.querySelector('.root');
        this.container = root.querySelector('.container');

        root.removeChild(this.container);
    };

    private handleConnect = () => {
        if (!this.container) {
            return;
        }

        const root = this.host.shadowRoot.querySelector('.root');
        root.appendChild(this.container);
        this.container = null;
    };

    private openPopover = (event: MouseEvent) => {
        event.stopPropagation();
        this.isOpen = true;
    };

    private onPopoverClose = (event: CustomEvent) => {
        event.stopPropagation();
        this.isOpen = false;
    };
}
