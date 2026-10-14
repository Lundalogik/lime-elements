import { Component, h, State } from '@stencil/core';

/**
 * Escape
 *
 * By default, the panel emits `close` when you press <kbd>Esc</kbd> anywhere on
 * the page. The panel does not remove itself. It is up to you to remove it.
 *
 * A popover, menu or dropdown inside the panel handles <kbd>Esc</kbd> first.
 * The first press closes it, and the next press closes the panel. This works
 * because the panel listens on `window`, which gets the event after all
 * listeners on elements and on `document`, and because the panel ignores an
 * Escape event that has `defaultPrevented` set. An element inside the panel
 * that handles <kbd>Esc</kbd> itself should call `preventDefault` on the event,
 * so that the panel does not close as well. `limel-dialog` does not do this
 * yet, so <kbd>Esc</kbd> in a dialog inside the panel also closes the panel.
 *
 * When more than one side panel is open, <kbd>Esc</kbd> closes only the panel
 * that was opened last. If that panel has `closeOnEscape` set to `false`,
 * <kbd>Esc</kbd> does not close any of the panels.
 *
 * Set `closeOnEscape` to `false` when pressing <kbd>Esc</kbd> by accident
 * should not close the panel, for example when it holds a form. The close
 * button still emits `close`. The panel does not prevent the key either, so
 * other elements on the page can use it.
 *
 * In this example, you can open the popover and press <kbd>Esc</kbd> twice.
 * The first press closes the popover, and the second press closes the panel.
 * Then open the panel again, turn off "Close on Escape" below the example, and
 * press <kbd>Esc</kbd>. The panel stays open. Use the close button to close it.
 */
@Component({
    tag: 'limel-example-side-panel-escape',
    shadow: true,
    styleUrl: 'side-panel-example.scss',
})
export class SidePanelEscapeExample {
    @State()
    private open = false;

    @State()
    private closeOnEscape = true;

    @State()
    private popoverOpen = false;

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public render() {
        return [
            <div class="page">
                <limel-button
                    primary
                    label="Open the panel"
                    onClick={this.openPanel}
                />
                {this.renderPanel()}
            </div>,
            <limel-example-controls>
                <limel-switch
                    label="Close on Escape"
                    value={this.closeOnEscape}
                    onChange={this.setCloseOnEscape}
                />
            </limel-example-controls>,
            <limel-example-event-printer
                ref={(element) => (this.eventPrinter = element)}
            />,
        ];
    }

    private renderPanel() {
        if (!this.open) {
            return;
        }

        return (
            <limel-side-panel
                closeOnEscape={this.closeOnEscape}
                onClose={this.closePanel}
            >
                <div class="panel-content">
                    <limel-popover
                        open={this.popoverOpen}
                        onClose={this.closePopover}
                    >
                        <limel-button
                            slot="trigger"
                            label="Open a popover"
                            onClick={this.openPopover}
                        />
                        <p>The popover handles Escape first.</p>
                    </limel-popover>
                </div>
            </limel-side-panel>
        );
    }

    private openPanel = () => {
        this.open = true;
    };

    private closePanel = (event: CustomEvent<void>) => {
        this.eventPrinter.writeEvent(event);
        this.open = false;
    };

    private openPopover = (event: MouseEvent) => {
        event.stopPropagation();
        this.popoverOpen = true;
    };

    private closePopover = (event: CustomEvent<void>) => {
        event.stopPropagation();
        this.popoverOpen = false;
    };

    private setCloseOnEscape = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.closeOnEscape = event.detail;
    };
}
