import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-popover',
    shadow: true,
    styleUrl: 'popover.scss',
})
export class PopoverExample {
    @State()
    private isOpen = false;

    constructor() {
        this.openPopover = this.openPopover.bind(this);
        this.onPopoverClose = this.onPopoverClose.bind(this);
    }

    public render() {
        return [
            <limel-button
                primary={true}
                label="Click me!"
                onClick={this.openPopover}
            />,
            <limel-popover open={this.isOpen} onClose={this.onPopoverClose}>
                <span slot="header">
                    <h3
                        style={{
                            margin: '0.5rem 1rem',
                            color: 'rgb(var(--contrast-100))',
                        }}
                    >
                        Header content
                    </h3>
                </span>
                <span slot="body">
                    <p style={{ margin: '0.5rem 1rem' }}>Body content</p>
                </span>
                <span slot="footer">
                    <span
                        style={{
                            margin: '0.5rem 1rem',
                            'font-size': '0.75rem',
                            color: 'rgb(var(--contrast-800))',
                        }}
                    >
                        Footer content
                    </span>
                </span>
            </limel-popover>,
        ];
    }

    private openPopover() {
        this.isOpen = true;
    }

    private onPopoverClose() {
        this.isOpen = false;
    }
}
