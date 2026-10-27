import { Component, Host, Prop, h } from '@stencil/core';
import { Help } from '../help/help.types';
import { HeadingLevel } from '../form/form.types';
import { getHelpProps } from './help-props';

/**
 * This is an internal and private component that `limel-form` uses to
 * draw the heading of a section, a list or a custom component, together
 * with its description and its help.
 *
 * Consumers of `limel-form` do not use it. They set the `title`,
 * the `description` and `lime.help` in the schema, and the form draws
 * this component with the right heading level.
 *
 * :::note
 * The component has `shadow: false`, so that the heading, the description
 * and the help are part of the DOM of `limel-form`. This way, the styles
 * of the form that depend on how deep a field is reach them directly.
 * :::
 *
 * @exampleComponent limel-example-form-header-basic
 * @exampleComponent limel-example-form-header-heading-level
 * @exampleComponent limel-example-form-header-help
 * @private
 */
@Component({
    tag: 'limel-form-header',
    shadow: false,
    styleUrl: 'form-header.scss',
})
export class FormHeader {
    /**
     * The title of the section, the list or the custom component.
     */
    @Prop()
    public heading?: string;

    /**
     * Which of the heading elements, from `h1` to `h6`, to draw
     * the `heading` with.
     */
    @Prop()
    public headingLevel: HeadingLevel = 1;

    /**
     * Text, in markdown, that describes what the `heading` is about.
     */
    @Prop()
    public description?: string;

    /**
     * Help to show beside the `heading`. A string is used as the `value`
     * of the help.
     */
    @Prop()
    public help?: string | Partial<Help>;

    public render() {
        return (
            <Host>
                {this.renderHeading()}
                {this.renderHelp()}
                {this.renderDescription()}
            </Host>
        );
    }

    private renderHeading() {
        if (!this.heading) {
            return;
        }

        const Heading = `h${this.headingLevel}` as 'h1';

        return <Heading>{this.heading}</Heading>;
    }

    private renderHelp() {
        if (!this.help) {
            return;
        }

        return <limel-help {...getHelpProps(this.help)} />;
    }

    private renderDescription() {
        if (!this.description) {
            return;
        }

        return <limel-markdown value={this.description} />;
    }
}
