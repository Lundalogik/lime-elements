import { Component, h, Host, State } from '@stencil/core';

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
        return (
            <Host>
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
                />
                <limel-example-controls>
                    <limel-switch
                        label="Disabled"
                        onChange={this.toggleEnabled}
                        value={this.disabled}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleInteraction = (event) => {
        console.log(event.detail);
    };

    private toggleEnabled = () => {
        this.disabled = !this.disabled;
    };
}
