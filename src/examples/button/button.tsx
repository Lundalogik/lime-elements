import { Component } from '@stencil/core';

@Component({
    tag: 'limel-example-button',
    shadow: true
})
export class ButtonExample {

    render() {
        return (
            <limel-button-group reverse-order>
                <limel-button label="Save" primary></limel-button>
                <limel-button label="Cancel"></limel-button>
            </limel-button-group>
        );
    }
}

