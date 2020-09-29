import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-colors-in-components',
    shadow: true,
    styleUrl: 'colors-in-components.scss',
})
export class ColorExample {
    public render() {
        return (
            <div class="background">
                <h3>Buttons</h3>
                <div class="example-buttons">
                    <limel-button class="success" label="Continue" />
                    <limel-button
                        primary={true}
                        class="caution"
                        label="Pause"
                    />
                    <limel-button
                        primary={true}
                        label="Do not press!"
                        style={{
                            '--lime-primary-color':
                                'rgb(var(--color-red-default))',
                        }}
                    />
                </div>
                <h3>Linear progress</h3>
                <p>
                    <limel-linear-progress value={0.5} />
                </p>
                <h3>Custom component</h3>
                <div class="box">This is a message.</div>
            </div>
        );
    }
}
