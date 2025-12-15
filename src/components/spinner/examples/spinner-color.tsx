import { Component, State, h } from '@stencil/core';
/**
 * With custom colors
 * The `limel-spinner` is designed to cycle through ten colors which are all
 * from Lime Technologies' brand colors.
 *
 * It is of course possible to override these colors.
 */
@Component({
    tag: 'limel-example-spinner-color',
    shadow: true,
    styleUrl: 'spinner-color.scss',
})
export class SpinnerColorExample {
    @State()
    private limeBranded = false;

    public render() {
        return [
            <limel-spinner size="medium" limeBranded={this.limeBranded} />,
            <limel-example-controls
                style={{ '--example-controls-column-layout': 'auto-fit' }}
            >
                <limel-switch
                    value={this.limeBranded}
                    label="Lime branded (default design)"
                    onChange={this.renderBranded}
                />
            </limel-example-controls>,
        ];
    }
    private renderBranded = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.limeBranded = event.detail;
    };
}
