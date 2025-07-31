import { Component, Host, Prop, h } from '@stencil/core';
import { Icon } from '../../interface';
import { getIconName } from '../icon/get-icon-props';
import { Image } from '../../global/shared-types/image.types';
import { createRandomString } from '../../util/random-string';

// The props should probably be imported from `list-item.types.ts` instead

/**
 * This components displays the list item.
 * This centralizes styles and functionality, and helps reduce redundant code
 * in consumer components such as `limel-list` and `limel-menu-list`.
 * @exampleComponent limel-example-list-item-basic
 * @private
 */
@Component({
    tag: 'limel-list-item',
    shadow: true,
    styleUrl: 'list-item.scss',
})
export class ListItem {
    /**
     * The label of the list item.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * The description of the list item.
     */
    @Prop({ reflect: true })
    public description?: string;

    /**
     * Icon of the list item.
     */
    @Prop()
    public icon?: string | Icon;

    /**
     * A picture to be displayed together with the icon
     * or on its own, in the list item.
     */
    @Prop()
    public image?: Image;

    /**
     * Set to `true` to disable the list item.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Set to `true` to visualize the chip in a "selected" state.
     * This is typically used when the chip is used in a chip-set
     * along with other chips.
     */
    @Prop({ reflect: true })
    public selected = false;

    /**
     * Used to describe the list item for assistive technology.
     */
    private readonly descriptionId: string;

    /**
     * Used to label the list item for assistive technology.
     */
    private readonly labelId: string;

    constructor() {
        this.labelId = createRandomString();
        this.descriptionId = createRandomString();
    }

    public render() {
        return (
            <Host
                aria-role="listitem"
                aria-labelledby={this.labelId}
                aria-describedby={
                    this.description ? this.descriptionId : undefined
                }
                aria-disabled={this.disabled ? 'true' : 'false'}
                aria-selected={this.selected ? 'true' : 'false'}
            >
                {this.renderIcon()}
                {this.renderImage()}
                <div class="text">
                    {this.renderLabel()}
                    {this.renderDescription()}
                </div>
            </Host>
        );
    }

    private renderLabel = () => {
        return <label id={this.labelId}>{this.label}</label>;
    };

    private renderDescription = () => {
        if (!this.description) {
            return;
        }

        return (
            <span class="description" id={this.descriptionId}>
                {this.description}
            </span>
        );
    };

    private renderIcon = (icon?: string | Icon) => {
        const iconName = getIconName(icon);
        if (!iconName) {
            return;
        }

        let iconColor: string | undefined;
        let iconBackgroundColor: string | undefined;

        if (typeof icon === 'object') {
            iconColor = icon.color;
            iconBackgroundColor = icon.backgroundColor;
        }

        const iconProps = {
            role: 'presentation',
            name: iconName,
            style: {
                color: iconColor,
                'background-color': iconBackgroundColor,
            },
        };

        return <limel-icon {...iconProps} />;
    };

    private renderImage = () => {
        if (!!this.image) {
            return;
        }

        return <img src={this.image.src} alt={this.image.alt} loading="lazy" />;
    };
}
