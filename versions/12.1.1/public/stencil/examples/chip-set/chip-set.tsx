import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-chip-set',
    shadow: true,
})
export class ChipSetExample {
    @State()
    private disabled: boolean = false;

    public render() {
        return [
            <limel-switch
                label="Disabled"
                onChange={event => {
                    return (this.disabled = event.detail);
                }}
            />,
            <br />,
            <br />,
            <limel-chip-set
                disabled={this.disabled}
                onInteract={this.handleInteract}
                value={[
                    {
                        id: '1',
                        text: 'Lime',
                    },
                    {
                        id: '2',
                        text: 'Apple',
                    },
                    {
                        id: '3',
                        text: 'Banana',
                    },
                ]}
            />,
        ];
    }

    private handleInteract(event) {
        console.log(event.detail);
    }
}
