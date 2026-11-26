import { Component, h, Host } from '@stencil/core';

/**
 * Initials instead of a picture
 *
 * Not everyone has a picture. For a chip that stands for a person or a
 * company, give `initials` with the `name` to read them from. When there is no
 * picture, the chip then shows the initials in a round tile of the same size,
 * instead of the icon. For the name of a company, add `nameType: 'company'`.
 * The documentation of [Initials](#/component/limel-initials/) explains how the
 * letters are worked out.
 *
 * When a chip has both `image` and `initials`, the picture is shown. If the
 * picture fails to load, the initials are shown instead, as for Jonas Ek
 * below. When the name gives no letters, the chip shows its icon.
 */
@Component({
    tag: 'limel-example-chip-initials',
    shadow: true,
    styleUrl: 'chip-badge.scss',
})
export class ChipInitialsExample {
    public render() {
        return (
            <Host>
                <limel-chip
                    text="Elin Berg"
                    icon="user"
                    initials={{ name: 'Elin Berg' }}
                />
                <limel-chip
                    text="Northwind Bikes AB"
                    icon="organization"
                    initials={{
                        name: 'Northwind Bikes AB',
                        nameType: 'company',
                    }}
                />
                <limel-chip
                    text="Jonas Ek"
                    icon="user"
                    initials={{ name: 'Jonas Ek' }}
                    image={{ src: 'data:image/png;base64,AAAA', alt: '' }}
                />
                <limel-chip
                    text="Lucy Chyzhova"
                    icon="user"
                    initials={{ name: 'Lucy Chyzhova' }}
                    image={{
                        src: 'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png',
                        alt: '',
                    }}
                />
            </Host>
        );
    }
}
