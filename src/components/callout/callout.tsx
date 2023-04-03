import { Component, h, Prop } from '@stencil/core';
import { CalloutType } from './callout.types';
import { getHeading, getIcon } from './callout.helpers';
import { Languages } from '@limetech/lime-elements';

/**
 * Callouts –also known as Admonitions– are useful for including supportive
 * or special content within a large piece of text,
 * or even inside a user interface.
 *
 * When used in a document or text based user interface, the callout attract
 * reader's attention to a particular piece of information,
 * without significantly interrupting their flow of reading the document.
 *
 * On a user interface, their usage will be experienced more intrusively by
 * end-users. But they could be good choices when you indent to slightly
 * disturb users' attention, and challenge them to pay extra attention
 * to the information presented. In such cases, callouts should not
 * be used as static and constantly present elements of a UI. They should
 * rather be displayed when something unusual or remarkable demands
 * users attention.
 *
 * @exampleComponent limel-example-callout-info
 * @exampleComponent limel-example-callout-warning
 * @exampleComponent limel-example-callout-note
 * @exampleComponent limel-example-callout-tip
 * @exampleComponent limel-example-callout-example
 * @exampleComponent limel-example-callout-custom-heading
 * @exampleComponent limel-example-callout-custom-icon
 * @exampleComponent limel-example-callout-custom-component
 * @exampleComponent limel-example-callout-styles
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
    public type?: CalloutType = 'info';

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
