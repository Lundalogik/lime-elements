import { Component, h, State } from '@stencil/core';

/**
 * Full screen
 *
 * Set `fullScreen` when the screen is too narrow for the panel to be displayed
 * on top of the page. The panel then covers the full width of the positioned
 * ancestor. It cannot be resized, and the backs of the stack are not shown.
 *
 * The panel does not decide this itself. The consumer sets `fullScreen`, for
 * example from a media query.
 *
 * In this example, use the switch to turn full screen on and off.
 */
@Component({
    tag: 'limel-example-side-panel-full-screen',
    shadow: true,
    styleUrl: 'side-panel-example.scss',
})
export class SidePanelFullScreenExample {
    @State()
    private open = false;

    @State()
    private fullScreen = true;

    public render() {
        return (
            <div class="page">
                <limel-button
                    primary
                    label="Open the panel"
                    onClick={this.openPanel}
                />
                {this.renderPanel()}
            </div>
        );
    }

    private renderPanel() {
        if (!this.open) {
            return;
        }

        return (
            <limel-side-panel
                fullScreen={this.fullScreen}
                stack={[{ heading: 'Start page' }, { heading: 'Sales pipe' }]}
                onClose={this.closePanel}
            >
                <div class="panel-content">
                    <limel-switch
                        label="Full screen"
                        value={this.fullScreen}
                        onChange={this.handleChangeFullScreen}
                    />
                </div>
            </limel-side-panel>
        );
    }

    private openPanel = () => {
        this.open = true;
    };

    private closePanel = () => {
        this.open = false;
    };

    private handleChangeFullScreen = (event: CustomEvent<boolean>) => {
        this.fullScreen = event.detail;
    };
}
