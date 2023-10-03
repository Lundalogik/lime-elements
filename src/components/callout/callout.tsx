import { Component, h, Prop } from '@stencil/core';
import { CalloutType, Languages } from '../../interface';
import { getHeading, getIcon } from './callout.helpers';

/**
 * Callouts—also known as Admonitions—are useful for including supportive or
 * special content within a large piece of text, or even inside a user
 * interface.
 *
 * When used in a document or text based user interface, the callout attracts
 * the reader's attention to a particular piece of information, without
 * significantly interrupting their flow of reading the document.
 *
 * In a user interface, a callout is more intrusive to the end-user. Still, it
 * could be a good choice when you intend to slightly disturb the user's
 * attention, and challenge them to pay extra attention to the information
 * presented. In such cases, a callout should not be used as a static and
 * constantly present element of the UI. Rather, it should be displayed when
 * something unusual or remarkable demands the user's attention.
 * @exampleComponent limel-example-callout-note
 * @exampleComponent limel-example-callout-important
 * @exampleComponent limel-example-callout-tip
 * @exampleComponent limel-example-callout-caution
 * @exampleComponent limel-example-callout-warning
 * @exampleComponent limel-example-callout-rich-content
 * @exampleComponent limel-example-callout-custom-heading
 * @exampleComponent limel-example-callout-custom-icon
 * @exampleComponent limel-example-callout-styles
 * @exampleComponent limel-example-custom-type
 * @exampleComponent limel-example-callout-composite
 */
@Component({
    tag: 'limel-callout',
    shadow: true,
    styleUrl: 'callout.scss',
})
export class Callout {
    /**
     * Heading of the callout, which can be used to override the
     * default heading which is displayed based on the chosen `type`.
     */
    @Prop({ reflect: true })
    public heading?: string;

    /**
     * Icon of the callout, which can be used to override the
     * default icon which is displayed based on the chosen `type`.
     */
    @Prop({ reflect: true })
    public icon?: string;

    /**
     * Defines how the component is visualized, for example
     * which heading, color or icon is used in its user interface.
     */
    @Prop({ reflect: true })
    public type?: CalloutType = 'note';

    /**
     * Defines the language for translations.
     * Will translate the default headings for supported languages.
     */
    @Prop()
    public language: Languages = 'en';

    public render() {
        return [
            <div class="side" role="presentation">
                <limel-icon name={getIcon(this.icon, this.type)} />
            </div>,
            <div class="main">
                <h1 class="heading">
                    {getHeading(this.heading, this.type, this.language)}
                </h1>
                <slot />
            </div>,
        ];
    }
}
