import { Component, h, State } from '@stencil/core';

/**
 * Basic example with no `type` set
 *
 * May be useful as a read-only presentation of a collection of tags, or
 * similar.
 *
 * Depending on the use case, you may also wish to consider
 * [limel-button](#/component/limel-button/) or
 * [limel-button-group](#/component/limel-button-group/).
 */
@Component({
    tag: 'limel-example-chip-set',
    shadow: true,
})
export class ChipSetExample {
    @State()
    private disabled: boolean = false;

    public render() {
        return [
            <limel-chip-set
                label="Tags"
                disabled={this.disabled}
                onInteract={this.handleInteraction}
                value={[
                    {
                        id: 1,
                        text: 'Fruit',
                    },
                    {
                        id: 2,
                        text: 'Green',
                    },
                    {
                        id: 3,
                        text: 'Sour',
                    },
                ]}
            />,
            <limel-example-controls>
                <limel-checkbox
                    label="Disabled"
                    onChange={this.toggleEnabled}
                    checked={this.disabled}
                />
            </limel-example-controls>,
        ];
    }

    private handleInteraction = (event) => {
        console.log(event.detail);
    };

    private toggleEnabled = () => {
        this.disabled = !this.disabled;
    };
}
