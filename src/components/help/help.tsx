import { Component, h, Prop, State } from '@stencil/core';
import { OpenDirection } from '../menu/menu.types';
import { Help } from '../help/help.types';
import { Link } from '../../global/shared-types/link.types';

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
 *
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
export class HelpComponent implements Help {
    /**
     * {@inheritdoc Help.value}
     */
    @Prop()
    public value: string;

    /**
     * {@inheritdoc Help.trigger}
     */
    @Prop()
    public trigger: string = '?';

    /**
     * {@inheritdoc Help.readMoreLink}
     */
    @Prop()
    public readMoreLink?: Link;

    /**
     * {@inheritdoc Help.openDirection}
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
