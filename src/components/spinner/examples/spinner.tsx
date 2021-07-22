import { Component, State, h } from '@stencil/core';
/**
 * With a generic design or branded for Lime Technologies
 * The `limel-spinner` makes the boring waiting times slightly more cheerful by
 * cycling through nine delightful colors.
 *
 * By default spinner's shape represents Lime Technologies' logo, as it is used
 * primarily in our own products.
 *
 * However, it is easy render the spinner as a generic circle by specifying
 * `limeBranded={false}`, which may be useful for instance when the
 * spinner is used on a small component like a button.
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
            <limel-flex-container justify="end">
                <limel-checkbox
                    checked={this.limeBranded}
                    label="Lime branded (default design)"
                    onChange={this.renderBranded}
                />
            </limel-flex-container>,
        ];
    }
    private renderBranded = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.limeBranded = event.detail;
    };
}
