import { Component, h, Host } from '@stencil/core';

const IMAGE_URL = 'https://lundalogik.github.io/lime-elements/';

const CONTACTS = [
    {
        name: 'Maja Lindqvist',
        picture: IMAGE_URL + '780af2a6-d3d1-4593-8642-f03210d09271.png',
    },
    { name: 'Elin Berg' },
    {
        name: 'Omar Haddad',
        picture: IMAGE_URL + '2e86c284-d190-4c41-8da2-4de50103a0cd.png',
    },
    { name: 'Jonas Ek' },
];

/**
 * Size and shape
 *
 * By default, the tile is a circle that is `2rem` wide and high. To change
 * that, set these CSS custom properties on the component, or on any element
 * around it:
 * - `--initials-size` sets the width and the height.
 * - `--initials-border-radius` sets how round the corners are.
 *
 * Initials are often shown together with pictures, as in this list of
 * contacts, where only some people have a picture. Give the tiles the same
 * size and shape as the pictures, and all the names line up in one column.
 *
 * The letters grow and shrink together with the tile, but never get so small
 * or so large that they become hard to read.
 */
@Component({
    tag: 'limel-example-initials-size',
    shadow: true,
    styleUrl: 'initials-examples.scss',
})
export class InitialsSizeExample {
    public render() {
        return (
            <Host
                style={{
                    '--initials-size': '3rem',
                    '--initials-border-radius': '0.5rem',
                }}
            >
                <ul>
                    {CONTACTS.map((contact) => (
                        <li key={contact.name}>
                            {contact.picture ? (
                                <img src={contact.picture} alt="" />
                            ) : (
                                <limel-initials name={contact.name} />
                            )}
                            {contact.name}
                        </li>
                    ))}
                </ul>
            </Host>
        );
    }
}
