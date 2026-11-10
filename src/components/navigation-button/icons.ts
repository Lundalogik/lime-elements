import { NavigationButtonType } from './navigation-button.types';

// Both types use the same icon. Their hover animations draw the rest.
const MINUS = 'M7 16h18';

/**
 * The shapes of the icons, as path data for an SVG with a `viewBox` of
 * `0 0 32 32`. The paths are drawn as lines. The stylesheet gives them their
 * stroke, so that they get the color of the text.
 *
 * An icon is one or more groups of paths. The stylesheet moves a group as a
 * whole when the user points at the button, and finds groups and paths by
 * their position, so their order matters:
 *
 * - `back` is a chevron. It slides left, and a line is drawn from its tip,
 *   so that together they look like an arrow.
 * - `expand` and `shrink` have a group for each arrow, with its head first
 *   and its shaft last. Only the heads are drawn, until the user points at
 *   the button. The heads then move, towards the corners for `expand` and
 *   towards the center for `shrink`, and the shafts are drawn.
 * - `newTab` has a group for the window behind, one for the window in front,
 *   and one for the arrow, with its head first and its shaft last. The window
 *   behind is an open outline, which lies on the outline of the window in
 *   front. The windows move apart, and the outline is open where the window
 *   in front would cover it. The arrow moves with the window in front, and
 *   its shaft is drawn further, back into the window behind.
 * - `float` is a rectangle. A bar is drawn inside its right edge.
 */
export const ICONS: Record<NavigationButtonType, string[][]> = {
    close: [['M8 8l16 16M24 8L8 24']],
    back: [['M20 7l-8 9 8 9']],
    expand: [
        ['M17 8h7v7', 'M24 8l-8 8'],
        ['M8 17v7h7', 'M8 24l8-8'],
    ],
    shrink: [
        ['M20 5v7h7', 'M20 12l8-8'],
        ['M12 27v-7H5', 'M12 20l-8 8'],
    ],
    minimize: [[MINUS]],
    maximize: [[MINUS]],
    float: [
        [
            'M8 7h16a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4z',
        ],
    ],
    newTab: [
        ['M12 6H9a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-3'],
        [
            'M9 6h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z',
        ],
        ['M14 12h6v6', 'M20 12L4 28'],
    ],
};
