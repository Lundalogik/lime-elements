import { Component } from '@stencil/core';

@Component({
    shadow: true,
    styleUrl: 'switch.scss',
    tag: 'docs-limel-switch',
})
export class SwitchExample {
    public render() {
        return [
            <limel-switch
                label="False - Enabled"
                value={false}
                onChange={event => {
                    console.log(event);
                }}
            />,
            <limel-switch
                label="True - Enabled"
                value={true}
                onChange={event => {
                    console.log(event);
                }}
            />,
            <limel-switch
                label="False - Disabled"
                value={false}
                disabled={true}
                onChange={event => {
                    console.log(event);
                }}
            />,
            <limel-switch
                label="True - Disabled"
                value={true}
                disabled={true}
                onChange={event => {
                    console.log(event);
                }}
            />,
        ];
    }
}
