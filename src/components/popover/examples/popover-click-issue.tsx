import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-popover-click-issue',
    shadow: true,
})
export class PopoverClickIssueExample {
    @State()
    private isPopoverOneOpen = false;

    @State()
    private isPopoverTwoOpen = false;

    @State()
    private isMenuOpen = false;

    @State()
    private stopPropagation = true;

    constructor() {
        this.openPopoverOne = this.openPopoverOne.bind(this);
        this.onPopoverOneClose = this.onPopoverOneClose.bind(this);
        this.openPopoverTwo = this.openPopoverTwo.bind(this);
        this.onPopoverTwoClose = this.onPopoverTwoClose.bind(this);
        this.openMenu = this.openMenu.bind(this);
    }

    public render() {
        return [
            <p>
                When using stopPropagation when clicking outside an open menu or
                popover the user is required to perform an extra click to first
                close the open menu/popover and then click the other trigger
                again to open the next, unlike how one would expect it to work.
            </p>,
            <p>
                The clickjacking in popover and menu is performed to avoid
                closing an open dialog when clicking outside the dialog when
                also having a menu/popover open. This causes this unwanted
                behavior and should probably be replaced with something else
                that checks the target of the click and then decides whether or
                not to use <code>event.stopPropagation()</code>.
            </p>,
            <p>
                With the checkbox ticked, only one click is needed to close one
                popover/menu and open another one.
            </p>,
            <limel-checkbox
                onChange={(ev: CustomEvent<boolean>) =>
                    (this.stopPropagation = !ev.detail)
                }
                checked={!this.stopPropagation}
                label="Stop clickjacking"
            />,
            <limel-flex-container>
                <limel-popover
                    stopPropagation={this.stopPropagation}
                    open={this.isPopoverOneOpen}
                    onClose={this.onPopoverOneClose}
                >
                    <limel-button
                        slot="trigger"
                        primary={true}
                        label="Popover one"
                        onClick={this.openPopoverOne}
                    />
                    <p style={{ margin: '0.5rem 1rem' }} tabindex="0">
                        Content
                    </p>
                </limel-popover>
                <limel-popover
                    stopPropagation={this.stopPropagation}
                    open={this.isPopoverTwoOpen}
                    onClose={this.onPopoverTwoClose}
                >
                    <limel-button
                        slot="trigger"
                        primary={true}
                        label="Popover two"
                        onClick={this.openPopoverTwo}
                    />
                    <p style={{ margin: '0.5rem 1rem' }} tabindex="0">
                        Content
                    </p>
                </limel-popover>
                <limel-menu
                    stopPropagation={this.stopPropagation}
                    open={this.isMenuOpen}
                    items={[{ text: 'Menu item', value: 'v' }]}
                >
                    <limel-button
                        slot="trigger"
                        primary={true}
                        label="Menu"
                        onClick={this.openMenu}
                    />
                </limel-menu>
            </limel-flex-container>,
        ];
    }

    private openPopoverOne() {
        console.log('opening popover one');
        this.isPopoverOneOpen = true;
    }

    private onPopoverOneClose() {
        console.log('closing popover one');
        this.isPopoverOneOpen = false;
    }

    private openPopoverTwo() {
        console.log('opening popover two');
        this.isPopoverTwoOpen = true;
    }

    private onPopoverTwoClose() {
        console.log('closing popover two');
        this.isPopoverTwoOpen = false;
    }

    private openMenu() {
        console.log('opening menu');
        this.isMenuOpen = true;
    }
}
