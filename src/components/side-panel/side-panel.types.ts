import { Color } from '../../global/shared-types/color.types';
import { Icon, IconName } from '../../global/shared-types/icon.types';

/**
 * One panel in the stack of a side panel.
 *
 * @beta
 */
export interface SidePanelEntry {
    /**
     * Heading of the panel.
     */
    heading: string;

    /**
     * Second line below the heading.
     */
    subheading?: string;

    /**
     * Icon shown next to the heading.
     */
    icon?: IconName | Icon;

    /**
     * Background color of the header. When it is set, the heading and the
     * subheading are white, with a text shadow, so that they are easier to
     * read on the color. Use a color that is dark enough for white text.
     */
    color?: Color;
}

/**
 * A button in the toolbar of a side panel.
 *
 * @beta
 */
export interface SidePanelAction {
    /**
     * The kind of button.
     */
    type: SidePanelActionType;

    /**
     * Label of the button. Shown as a tooltip and used as the accessible name.
     */
    label: string;

    /**
     * Identifies the action in the `selectAction` event. Defaults to `type`.
     */
    id?: string;

    /**
     * Additional text in the tooltip, below the label. For example the name
     * of what the action opens.
     */
    helperLabel?: string;

    /**
     * If set, the action is a link to this URL. The user can then open it in
     * a new tab, like any other link. `selectAction` is still emitted. To
     * handle the navigation in another way, call `preventDefault` on its
     * `event`, but only for a plain click with the primary button: `button` is
     * `0`, and `metaKey`, `ctrlKey`, `shiftKey` and `altKey` are `false`. Let
     * the browser handle all other clicks, so that the user can still open the
     * link in a new tab.
     */
    href?: string;
}

/**
 * Detail of the `selectAction` event of a side panel.
 *
 * @beta
 */
export interface SidePanelActionSelect {
    /**
     * The `id` of the clicked action, or its `type` if it has no `id`.
     */
    id: string;

    /**
     * The click event.
     */
    event: MouseEvent;
}

/**
 * The kinds of buttons that can be used as actions in a side panel.
 *
 * @beta
 */
export type SidePanelActionType = 'newTab' | 'expand';
