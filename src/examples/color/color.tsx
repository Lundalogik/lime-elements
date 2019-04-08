import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-color',
    shadow: true,
    styleUrl: 'color.scss',
})
export class ColorExample {
    public render() {
        return [
            <limel-button label="I'm blue!" />,
            <br />,
            <br />,
            <limel-button
                primary={true}
                label="Do not press!"
                style={{
                    '--lime-primary-color': 'var(--lime-red)',
                }}
            />,
            <br />,
            <br />,
            <div class="box" />,
        ];
    }
}
