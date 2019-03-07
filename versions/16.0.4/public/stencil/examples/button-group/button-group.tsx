import { Component } from '@stencil/core';

@Component({
    tag: 'limel-example-button-group',
    shadow: true,
})
export class ButtonGroupExample {
    public render() {
        return [
            <section>
                <h3>Default</h3>
                <limel-button-group>
                    <limel-button label="Save" primary={true} />
                    <limel-button label="Cancel" />
                </limel-button-group>
            </section>,
            <section>
                <h3>Reverse order</h3>
                <limel-button-group class="reverse-order">
                    <limel-button label="Save" primary={true} />
                    <limel-button label="Cancel" />
                </limel-button-group>
            </section>,
            <section>
                <h3>Centered</h3>
                <limel-button-group class="center">
                    <limel-button label="Save" primary={true} />
                    <limel-button label="Cancel" />
                </limel-button-group>
            </section>,
            <section>
                <h3>Centered &amp; reverse order</h3>
                <limel-button-group class="center reverse-order">
                    <limel-button label="Save" primary={true} />
                    <limel-button label="Cancel" />
                </limel-button-group>
            </section>,
        ];
    }
}
