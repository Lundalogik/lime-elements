import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-chip-set',
    shadow: true,
})
export class ChipSetExample {
    @State()
    private disabled: boolean = false;

    constructor() {
        this.disabledOnChange = this.disabledOnChange.bind(this);
        this.onInteract = this.onInteract.bind(this);
    }

    public render() {
        return [
            <limel-switch label="Disabled" onChange={this.disabledOnChange} />,
            <br />,
            <br />,
            <limel-chip-set
                disabled={this.disabled}
                onInteract={this.onInteract}
                value={[
                    {
                        id: 1,
                        text: 'Lime',
                    },
                    {
                        id: 2,
                        text: 'Apple',
                    },
                    {
                        id: 3,
                        text: 'Banana',
                    },
                ]}
            />,
        ];
    }

    private disabledOnChange(event) {
        this.disabled = event.detail;
    }

    private onInteract(event) {
        console.log(event.detail);
    }
}
