import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Loading state
 * Setting the `loading` to `true` puts the component in the `loading` state,
 * and renders spinner within the UI.
 *
 * :::note
 * Note that this does _not_ disable the interactivity of the component,
 * and most probably you do not need it to be disabled either.
 * If the component should be disabled while loading, the
 * `disabled` property should separately be set to `true` as well.
 * :::
 * :::tip
 * Consider using [aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live)
 * where appropriate, or to inform the user about what is being loaded
 * use a [tooltip](#/component/limel-tooltip) on the component.
 * This is mainly to improve the accessibility for users of assistive technologies.
 * :::
 */
@Component({
    tag: 'limel-example-profile-picture-loading',
    shadow: true,
    styleUrl: 'profile-picture-basic.scss',
})
export class ProfilePictureLoadingExample {
    @State()
    private value: FileInfo = {
        filename: 'me.png',
        id: 1,
        href: 'https://avatars.githubusercontent.com/u/9919?v=4',
    };

    @State()
    public loading = false;

    public render() {
        return (
            <Host>
                <limel-profile-picture
                    value={this.value}
                    loading={this.loading}
                />
                <limel-example-controls>
                    <limel-switch
                        label="Loading"
                        value={this.loading}
                        onChange={this.setLoading}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private setLoading = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.loading = event.detail;
    };
}
