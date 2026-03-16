import { Component, State, h } from '@stencil/core';
/**
 * With a generic design or branded for Lime Technologies
 * The `limel-spinner` makes the boring waiting times slightly more cheerful by
 * cycling through nine delightful colors.
 *
 * By default, the spinner is rendered as a circle.
 * However, it is possible to set `limeBranded={true}`,
 * which renders the spinner's shape as Lime Technologies' logo.
 */
@Component({
    tag: 'limel-example-spinner',
    shadow: true,
})
export class SpinnerExample {
    @State()
    private limeBranded = true;

    public render() {
        return [
            <limel-spinner size="medium" limeBranded={this.limeBranded} />,
            <limel-example-controls
                style={{ '--example-controls-column-layout': 'auto-fit' }}
            >
                <limel-switch
                    value={this.limeBranded}
                    label="Lime branded"
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
