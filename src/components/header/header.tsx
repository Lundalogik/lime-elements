import { Component, h, Prop } from '@stencil/core';

/**
 * A header is the top most visual element in a component, page, card, or a view.
 *
 * ## Usage
 * A header is the first thing that clarifies a context for users.
 * Due to their positions in the UI hierarchy, headers are the most
 * prominent elements of a user interface; and because of that, they carry both
 * vital information and fundamental controls for the area of the interface
 * they represent.
 *
 * For example, when a header is placed on top of a card, it should quickly
 * explain the card to the user. When placed on top of a modal, it should easily
 * clarify what the modal is about. When displayed on top of a fullscreen view,
 * it should indicate where in the system users are, and what part of the app
 * they are looking at.
 *
 *
 * ## Layout
 * The vital information in a header is usually manifested in form of an icon,
 * and a heading. A subheading also could be added to provide supplementary
 * information.
 *
 * Along with this information, headers can also include actions, controls, or
 * menus.
 *
 * :::important
 * Such actions or menus must affect the entire section of the interface
 * which the header is representing. For example, a _Delete_ button on a card
 * header must delete that entire card and its respective contents all together,
 * not for example a selected item which is visible in the content of that card.
 * :::
 *
 *
 * :::warning
 * Do not user background color on icons in the headers. It is much better and
 * much easier for the eye if your icon itself has a color.
 * Background colors behind icons make them look like "call to action" buttons
 * and take a lot of attention from users.
 * :::
 *
 * @exampleComponent limel-example-header
 * @exampleComponent limel-example-header-responsive
 * @exampleComponent limel-example-header-narrow
 * @slot - Content (actions) to be put inside the far right surface of the header
 * @private
 */
@Component({
    tag: 'limel-header',
    shadow: true,
    styleUrl: 'header.scss',
})
export class Header {
    /**
     * Icon to display
     */
    @Prop()
    public icon: string;

    /**
     * Title to display
     */
    @Prop()
    public heading: string;

    /**
     * Subheading to display
     */
    @Prop()
    public subheading: string;

    public render() {
        return [
            <div class="information">
                <limel-icon
                    class="information__icon"
                    badge={true}
                    size="large"
                    name={this.icon}
                />
                <div class="information__headings">
                    <h1
                        class="information__headings__heading"
                        title={this.heading}
                    >
                        {this.heading}
                    </h1>
                    <h2
                        class="information__headings__subheading"
                        title={this.subheading}
                    >
                        {this.subheading}
                    </h2>
                </div>
            </div>,
            <div class="actions">
                <slot />
            </div>,
        ];
    }
}
