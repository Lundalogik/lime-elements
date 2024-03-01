import { OpenDirection } from '../menu/menu.types';
import { Link } from '../../global/shared-types/link.types';

export interface Help {
    /**
     * Decides the popover's location in relation to the trigger.
     */
    openDirection: OpenDirection;

    /**
     * If supplied, it will render a "Read more" link at the bottom of the content.
     * Even though you can add a link anywhere in the content, it is recommended to
     * use the read more link. Because it will always be displayed at the bottom
     * of the popover after the content, does not scroll away with the content,
     * and it will be styled in a consistent way.
     */
    readMoreLink?: Link;

    /**
     * Visualizes the trigger element. Defaults to: **?**
     * :::important
     * Be consistent across the product if you want to change it to a custom character.
     * All instances of the help component should have the same trigger visualization.
     * :::
     */
    trigger: string;

    /**
     * The markdown content that will be displayed in the popover.
     */
    value: string;
}
