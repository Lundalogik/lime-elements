import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-size',
    shadow: true,
    styleUrl: 'size.scss',
})
export class SizerExample {
    public render() {
        return [
            <button class="custom-made-button">Button 1</button>,
            <button class="custom-made-button">Button 2</button>,
            <button class="custom-made-button">Button 3</button>,
        ];
    }
}
