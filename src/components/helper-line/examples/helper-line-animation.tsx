import { Component, State, h } from '@stencil/core';

/**
 * Animating the appearance of the helper line
 *
 * It is possible to hide the helper line component with a
 * smooth animation of its height.
 * Simply add the `class="hide"` to the component,
 * and it will take care fo the animations.
 */
@Component({
    tag: 'limel-example-helper-line-animation',
    shadow: true,
})
export class HelperLineAnimationExample {
    @State()
    private hide: boolean = false;

    public render() {
        const longHelperText =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

        return [
            <limel-checkbox
                label="Hide helper line"
                onChange={this.toggleMode}
                checked={this.hide}
            />,
            <limel-helper-line
                class={{ hide: this.hide }}
                helperText={longHelperText}
                length={10}
                maxLength={20}
                helperTextId="tf-helper-text"
            />,
        ];
    }

    private toggleMode = () => {
        this.hide = !this.hide;
    };
}
