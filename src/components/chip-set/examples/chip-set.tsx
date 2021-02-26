import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-chip-set',
    shadow: true,
})
export class ChipSetExample {
    @State()
    private disabled: boolean = false;

    constructor() {
        this.onInteract = this.onInteract.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }

    public render() {
        return [
            <limel-chip-set
                label="Tags"
                disabled={this.disabled}
                onInteract={this.onInteract}
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
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        label="Disabled"
                        onChange={this.toggleEnabled}
                        checked={this.disabled}
                    />
                </limel-flex-container>
            </p>,
        ];
    }

    private onInteract(event) {
        console.log(event.detail);
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }
}
