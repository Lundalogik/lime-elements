import { Component, h, State } from '@stencil/core';

/**
 * Tooltip for icons
 * with supporting a hotkey
 */

@Component({
    tag: 'limel-example-tooltip',
    shadow: true,
    styleUrl: 'tooltip.scss',
})
export class TooltipExample {
    @State()
    private isOpen = false;

    public render() {
        return [
            <limel-button
                icon="search"
                onMouseOver={this.showTooltip}
                onMouseOut={this.hideTooltip}
                onClick={this.hideTooltip}
            />,
            <limel-tooltip
                open={this.isOpen}
                label={'Search'}
                helperLabel={'alt+f'}
            />,
        ];
    }

    private showTooltip = () => {
        this.isOpen = true;
    };

    private hideTooltip = () => {
        this.isOpen = false;
    };
}
