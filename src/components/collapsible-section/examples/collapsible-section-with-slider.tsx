import { Component, h, State } from '@stencil/core';

/**
 * With a limel-slider - for testing
 * :::note
 * Some elements need to be redrawn if they were created
 * while their container was hidden. The collapsible
 * section will emit a resize event after opening, to make this happen.
 * :::
 */
@Component({
    tag: 'limel-example-collapsible-section-with-slider',
    shadow: true,
})
export class CollapsibleSectionWithSliderExample {
    @State()
    private percentage = 34;

    public render() {
        return (
            <limel-collapsible-section header="With a limel-slider">
                <div>
                    <p>This is primarily here for testing purposes.</p>
                    <limel-slider unit="%" value={this.percentage} />
                </div>
            </limel-collapsible-section>
        );
    }
}
