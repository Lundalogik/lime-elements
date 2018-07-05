import { Component } from '@stencil/core';

@Component({
    tag: 'limel-example-switch',
    styleUrl: 'switch.scss',
    shadow: true
})
export class SwitchExample {

    render() {
        return [
            <limel-switch
                label="False - Enabled"
                value={false}
                onChange={event => console.log(event)}/>,
            <limel-switch
                label="True - Enabled"
                value={true}
                onChange={event => console.log(event)}/>,
            <limel-switch
                label="False - Disabled"
                value={false}
                disabled
                onChange={event => console.log(event)}/>,
            <limel-switch
                label="True - Disabled"
                value={true}
                disabled
                onChange={event => console.log(event)}/>,
        ]
    }
}
