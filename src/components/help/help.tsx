import { Component, h, Prop, State } from '@stencil/core';
import { OpenDirection } from '../menu/menu.types';
import { Link } from '../../interface';

/**
 * A good design is self-explanatory! However, sometimes concepts are
 * too complex to understand, no matter how well-designed a user interface is.
 * In such cases, contextual help can be a great way to provide users with
 * help precisely where and when users need it.
 *
 * In app interface design, providing contextual help emerges as a viable practice
 * for enhancing user experience and usability.
 * Contextual help serves as a quick-to-access guiding,
 * empowering users to more easily understand and navigate through
 * the intricacies of an application.
 *
 * Using this component designers empower users to grasp the functionality
 * of an app more effortlessly, minimizes the learning curve,
 * transforming complex features into accessible opportunities for exploration.
 * @exampleComponent limel-example-help
 * @exampleComponent limel-example-read-more
 * @exampleComponent limel-example-open-direction
 * @exampleComponent limel-example-placement
 */
@Component({
    tag: 'limel-help',
    shadow: true,
    styleUrl: 'help.scss',
})
export class Help {
    /**
     * The markdown content that will be displayed in the popover.
     */
    @Prop()
    public value: string;

    /**
     * Visualizes the trigger element. Defaults to: **?**
     * :::important
     * Be consistent across the product if you want to change it to a custom character.
     * All instances of the help component should have the same trigger visualization.
     * :::
     */
    @Prop()
    public trigger: string = '?';

    /**
     * If supplied, it will render a "Read more" link at the bottom of the content.
     * Even though you can add a link anywhere in the content, it is recommended to
     * use the read more link. Because it will always be displayed at the bottom
     * of the popover after the content, does not scroll away with the content,
     * and it will be styled in a consistent way.
     */
    @Prop()
    public readMoreLink?: Link;

    /**
     * Decides the popover's location in relation to the trigger.
     */
    @Prop({ reflect: true })
    public openDirection: OpenDirection = 'top-start';

    @State()
    private isOpen = false;

    public render() {
        return [
            <limel-popover
                open={this.isOpen}
                onClose={this.onPopoverClose}
                openDirection={this.openDirection}
            >
                <button
                    slot="trigger"
                    onClick={this.openPopover}
                    class={{
                        'is-open': this.isOpen,
                    }}
                >
                    {this.trigger}
                </button>
                <limel-help-content
                    value={this.value}
                    readMoreLink={this.readMoreLink}
                />
            </limel-popover>,
        ];
    }

    private openPopover = (event: MouseEvent) => {
        event.stopPropagation();
        this.isOpen = true;
    };

    private onPopoverClose = (event: CustomEvent) => {
        event.stopPropagation();
        this.isOpen = false;
    };
}
