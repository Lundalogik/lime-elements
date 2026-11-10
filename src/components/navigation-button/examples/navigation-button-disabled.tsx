import { Component, Host, h, State } from '@stencil/core';
import { LimelSwitchCustomEvent } from '@limetech/lime-elements';

/**
 * Disabled
 * A disabled navigation button cannot be clicked or focused, and screen
 * readers announce it as unavailable. Its tooltip is still shown when the
 * user points at it, so that they can find out what the button is for.
 *
 * This works the same way for a button and for a link. A disabled link is
 * still a link to a screen reader, but it does not lead anywhere until it is
 * enabled again.
 */
@Component({
    tag: 'limel-example-navigation-button-disabled',
    shadow: true,
    styleUrl: 'navigation-button-example.scss',
})
export class NavigationButtonDisabledExample {
    @State()
    private disabled = true;

    public render() {
        return (
            <Host>
                <figure>
                    <limel-navigation-button
                        type="back"
                        disabled={this.disabled}
                    />
                    <figcaption>Button</figcaption>
                </figure>
                <figure>
                    <limel-navigation-button
                        type="back"
                        href="https://lundalogik.github.io/lime-elements/versions/latest/#/"
                        disabled={this.disabled}
                    />
                    <figcaption>Link</figcaption>
                </figure>
                <limel-example-controls>
                    <limel-switch
                        label="Disabled"
                        value={this.disabled}
                        onChange={this.setDisabled}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly setDisabled = (event: LimelSwitchCustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };
}
