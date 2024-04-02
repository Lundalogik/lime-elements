import { Component, h } from '@stencil/core';
import { avatarAsDataUri } from './avatarAsDataUri';

/**
 * Displaying an image instead of an icon
 *
 * Because the `limel-icon` component is used by several other components
 * already, we have added the ability to display an image instead of an icon.
 * This makes it possible to display a user avatar, for example, anywhere that
 * an icon is used.
 *
 * To render an image, simply provide the URL to the image as the `src`
 * property. Data-URIs are also supported.
 *
 * :::note
 * If the URL points to an SVG image, it will be rendered, but it will not be
 * possible to change its color using CSS.
 *
 * @sourceFile avatarAsDataUri.ts
 */
@Component({
    tag: 'limel-example-icon-image',
    shadow: true,
    styleUrl: 'icon-size.scss',
})
export class IconSizeExample {
    public render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Size</th>
                        <th>
                            With <code>badge</code>
                        </th>
                        <th>
                            Without <code>badge</code>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <code>x-small</code>
                        </td>
                        <td>
                            <limel-icon
                                src="https://lundalogik.github.io/lime-elements/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png"
                                size="x-small"
                                badge={true}
                            />
                        </td>
                        <td>
                            <limel-icon
                                src="https://lundalogik.github.io/lime-elements/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png"
                                size="x-small"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>small</code>
                        </td>
                        <td>
                            <limel-icon
                                src="https://lundalogik.github.io/lime-elements/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png"
                                size="small"
                                badge={true}
                            />
                        </td>
                        <td>
                            <limel-icon
                                src="https://lundalogik.github.io/lime-elements/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png"
                                size="small"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>medium</code>
                        </td>
                        <td>
                            <limel-icon
                                src="https://lundalogik.github.io/lime-elements/2e86c284-d190-4c41-8da2-4de50103a0cd.png"
                                size="medium"
                                badge={true}
                            />
                        </td>
                        <td>
                            <limel-icon
                                src="https://lundalogik.github.io/lime-elements/2e86c284-d190-4c41-8da2-4de50103a0cd.png"
                                size="medium"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>large</code>
                        </td>
                        <td>
                            <limel-icon
                                src="https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png"
                                size="large"
                                badge={true}
                            />
                        </td>
                        <td>
                            <limel-icon
                                src="https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png"
                                size="large"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>custom</code>
                            <p>Size is set in CSS.</p>
                        </td>
                        <td>
                            <limel-icon
                                class="custom-size"
                                src="https://lundalogik.github.io/lime-elements/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png"
                                badge={true}
                            />
                            <limel-icon
                                class="custom-size"
                                src="https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png"
                                badge={true}
                            />
                        </td>
                        <td>
                            <limel-icon
                                class="custom-size"
                                src={avatarAsDataUri}
                            />
                            <limel-icon
                                class="custom-size"
                                src="https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
